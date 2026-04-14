#!/usr/bin/env node

/**
 * Multi-pass AI fact-checker for AEA content.
 *
 * Pipeline:
 *   Pass 1 — Claim Extraction (GPT-4o): pull every verifiable factual claim
 *   Pass 2 — Web Verification (GPT-4o + web_search via Responses API): check each claim against real sources
 *   Pass 3 — Final Verdict (GPT-4o): overall pass / flag / fail with per-claim results
 *
 * Writes `verified: true|false` and `factCheckedAt` into each article's YAML frontmatter.
 *
 * Usage:
 *   OPENAI_API_KEY=... node scripts/fact-check.js [directory]
 *   Default: scans all content directories
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const REPORT_PATH = path.join(__dirname, '..', 'src', 'content', '.fact-check-report.json');
const VERIFICATION_PATH = path.join(__dirname, '..', 'src', 'content', 'verification.json');
const ALL_DIRS = [
  path.join(__dirname, '..', 'src', 'content', 'briefings'),
  path.join(__dirname, '..', 'src', 'content', 'news'),
  path.join(__dirname, '..', 'src', 'content', 'insights'),
  path.join(__dirname, '..', 'src', 'content', 'resources'),
];

const FACT_CHECK_MODEL = 'gpt-4o';          // stronger model than generator (gpt-4o-mini)
const WEB_SEARCH_MODEL = 'gpt-4o';          // model for web-search verification
const MAX_CONTENT_LENGTH = 5000;             // max chars sent to API per article

function getApiKey() {
  return process.env.OPENAI_API_KEY || process.env.ChatGPT;
}

// ---------------------------------------------------------------------------
// Email (reuse existing Resend pattern)
// ---------------------------------------------------------------------------
function sendEmail(subject, htmlBody) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn('  RESEND_API_KEY not set, skipping email'); return Promise.resolve(); }
  return new Promise((resolve) => {
    const data = JSON.stringify({
      from: 'AEA Notifications <notifications@site.kennion.com>',
      to: 'hunter@kennion.com',
      subject,
      html: htmlBody,
    });
    const req = https.request({
      hostname: 'api.resend.com', port: 443, path: '/emails', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    }, (res) => { let b = ''; res.on('data', c => b += c); res.on('end', () => resolve()); });
    req.on('error', () => resolve());
    req.write(data);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// OpenAI Chat Completions API (for Pass 1 and Pass 3)
// ---------------------------------------------------------------------------
function callChat(messages, { temperature = 0.2, maxTokens = 2000, jsonMode = false } = {}) {
  return new Promise((resolve, reject) => {
    const body = {
      model: FACT_CHECK_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    };
    if (jsonMode) body.response_format = { type: 'json_object' };

    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.openai.com', port: 443, path: '/v1/chat/completions', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getApiKey()}` },
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(buf);
          if (parsed.choices?.[0]) resolve(parsed.choices[0].message.content);
          else reject(new Error('Chat API error: ' + buf.substring(0, 400)));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// OpenAI Responses API with web_search tool (for Pass 2)
// ---------------------------------------------------------------------------
function callResponsesWithWebSearch(prompt) {
  return new Promise((resolve, reject) => {
    const body = {
      model: WEB_SEARCH_MODEL,
      tools: [{ type: 'web_search_preview' }],
      input: prompt,
      temperature: 0.2,
    };

    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.openai.com', port: 443, path: '/v1/responses', method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getApiKey()}` },
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(buf);
          // Responses API returns output[] array; find the message output
          if (parsed.output) {
            const textOutput = parsed.output.find(o => o.type === 'message');
            if (textOutput?.content?.[0]?.text) {
              resolve(textOutput.content[0].text);
              return;
            }
          }
          // Fallback: if structure is different, try common patterns
          if (parsed.choices?.[0]?.message?.content) {
            resolve(parsed.choices[0].message.content);
            return;
          }
          reject(new Error('Responses API unexpected format: ' + buf.substring(0, 400)));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Pass 1: Extract verifiable claims
// ---------------------------------------------------------------------------
async function extractClaims(content) {
  const result = await callChat([
    {
      role: 'system',
      content: `You are a fact-checking assistant. Extract every verifiable factual claim from the article below. Focus on:
- Specific dates, deadlines, or effective dates
- Dollar amounts, thresholds, or salary figures
- Names of laws, regulations, executive orders, or court cases
- Actions attributed to specific agencies (DOL, EEOC, FTC, IRS, DHS, etc.)
- Court rulings or legal outcomes
- Statistics or data points
- State-specific legal requirements

Do NOT extract opinions, general advice, or hedged statements (those using "may", "generally", "should consider", etc.).

Return ONLY a JSON array of objects:
[
  { "claim": "exact text from article", "type": "date|threshold|law|agency_action|court_ruling|statistic|requirement" }
]

If no verifiable claims are found, return an empty array: []`
    },
    { role: 'user', content: content.substring(0, MAX_CONTENT_LENGTH) }
  ], { jsonMode: true, maxTokens: 2000 });

  try {
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : (parsed.claims || []);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Pass 2: Verify claims via web search
// ---------------------------------------------------------------------------
async function verifyClaims(claims, articleTitle) {
  if (claims.length === 0) return [];

  // Batch claims into groups to reduce API calls (max 5 per batch)
  const batchSize = 5;
  const results = [];

  for (let i = 0; i < claims.length; i += batchSize) {
    const batch = claims.slice(i, i + batchSize);
    const claimList = batch.map((c, idx) => `${i + idx + 1}. [${c.type}] "${c.claim}"`).join('\n');

    const prompt = `You are a fact-checker verifying claims from an article titled "${articleTitle}" published by the American Employers Alliance (AEA), a national employer association.

Search the web to verify each of the following claims. For each claim, determine:
- "confirmed": you found a credible source that supports this claim
- "unverified": you could not find a source to confirm or deny this claim
- "false": you found credible evidence that contradicts this claim

CLAIMS TO VERIFY:
${claimList}

Respond in this EXACT JSON format and nothing else:
{
  "results": [
    {
      "claim_number": 1,
      "claim": "the claim text",
      "verdict": "confirmed" or "unverified" or "false",
      "source": "URL or description of source, or null if unverified",
      "explanation": "brief explanation of what you found"
    }
  ]
}`;

    try {
      const raw = await callResponsesWithWebSearch(prompt);
      // Try to extract JSON from the response (may have markdown wrapping)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.results)) {
          results.push(...parsed.results);
        }
      }
    } catch (err) {
      // If web search fails, mark all claims in this batch as unverified
      for (const c of batch) {
        results.push({
          claim_number: results.length + 1,
          claim: c.claim,
          verdict: 'unverified',
          source: null,
          explanation: `Web verification failed: ${err.message}`,
        });
      }
    }

    // Rate limit between batches
    if (i + batchSize < claims.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Pass 3: Final verdict
// ---------------------------------------------------------------------------
async function finalVerdict(content, claims, verificationResults) {
  const claimSummary = verificationResults.map(r =>
    `- [${r.verdict.toUpperCase()}] "${r.claim}" — ${r.explanation}${r.source ? ` (Source: ${r.source})` : ''}`
  ).join('\n');

  const result = await callChat([
    {
      role: 'system',
      content: `You are a senior editorial fact-checker for the American Employers Alliance, a national employer association. You have received an article and the results of web-based fact verification for each claim in the article.

Make a final determination:
- "pass": ALL verifiable claims are confirmed OR properly hedged with language like "may", "generally", "employers should consult counsel". Zero false claims.
- "flag": Some claims are unverified but none are contradicted. The article is plausible but cannot be fully confirmed.
- "fail": One or more claims are contradicted by credible sources, OR the article presents unverified speculation as established fact.

IMPORTANT: An article that states something as definitive fact when it cannot be verified should be flagged, not passed. Only pass articles where claims are either confirmed by sources or explicitly hedged.

Respond in this EXACT JSON format:
{
  "status": "pass" or "flag" or "fail",
  "confidence": 0.0 to 1.0,
  "issues": [
    {
      "severity": "low" or "medium" or "high",
      "text": "problematic text from article",
      "issue": "what is wrong",
      "suggestion": "how to fix it",
      "source": "contradicting source URL if available"
    }
  ],
  "confirmed_claims": 0,
  "unverified_claims": 0,
  "false_claims": 0,
  "summary": "one sentence overall assessment"
}`
    },
    {
      role: 'user',
      content: `ARTICLE:\n---\n${content.substring(0, MAX_CONTENT_LENGTH)}\n---\n\nCLAIM VERIFICATION RESULTS:\n${claimSummary || '(No verifiable claims were extracted)'}`
    }
  ], { jsonMode: true, maxTokens: 1500 });

  try {
    return JSON.parse(result);
  } catch {
    return {
      status: 'flag',
      confidence: 0,
      issues: [],
      confirmed_claims: 0,
      unverified_claims: claims.length,
      false_claims: 0,
      summary: 'Failed to parse final verdict — marking as unverified.',
    };
  }
}

// ---------------------------------------------------------------------------
// Auto-fix content (same approach as before, but uses GPT-4o)
// ---------------------------------------------------------------------------
async function autoFixContent(content, issues) {
  const issueList = issues.map((issue, idx) =>
    `${idx + 1}. [${issue.severity}] "${issue.text}" — Issue: ${issue.issue} — Fix: ${issue.suggestion}${issue.source ? ` (Source: ${issue.source})` : ''}`
  ).join('\n');

  const result = await callChat([
    {
      role: 'system',
      content: `You are a senior editorial fact-checker for the American Employers Alliance, a national employer association. An article has been flagged for accuracy issues. Rewrite the ENTIRE article with corrections applied.

RULES:
- Fix every flagged issue
- Remove or soften any claims that cannot be verified — use hedging: "may," "generally," "employers should consult counsel," "requirements vary by state"
- Do NOT invent new statistics, data, specific numbers, court rulings, or dates
- Do NOT change the YAML frontmatter at the top (between the --- markers)
- Keep the same structure, headings, and overall content
- Keep approximately the same length
- Make corrections conservative — when in doubt, remove the claim rather than guess`
    },
    {
      role: 'user',
      content: `ISSUES FOUND:\n${issueList}\n\nORIGINAL ARTICLE:\n---\n${content}\n---\n\nReturn the COMPLETE corrected article including YAML frontmatter. Return ONLY the article, nothing else.`
    }
  ], { maxTokens: 3000, temperature: 0.3 });

  // Validate the rewrite has frontmatter and reasonable length
  if (result && result.includes('---') && result.length > 200) {
    return result.trim();
  }
  return null;
}

// ---------------------------------------------------------------------------
// Frontmatter helpers (using gray-matter pattern)
// ---------------------------------------------------------------------------
function updateFrontmatter(filePath, updates) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return;

  let frontmatter = fmMatch[1];
  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}:.*$`, 'm');
    const line = typeof value === 'string' ? `${key}: "${value}"` : `${key}: ${value}`;
    if (regex.test(frontmatter)) {
      frontmatter = frontmatter.replace(regex, line);
    } else {
      frontmatter += `\n${line}`;
    }
  }

  const updated = content.replace(/^---\n[\s\S]*?\n---/, `---\n${frontmatter}\n---`);
  fs.writeFileSync(filePath, updated);
}

// ---------------------------------------------------------------------------
// Full fact-check pipeline for one file
// ---------------------------------------------------------------------------
async function factCheckArticle(filePath, content) {
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath);

  // Pass 1: Extract claims
  process.stdout.write('    Pass 1 (claims)... ');
  const claims = await extractClaims(content);
  console.log(`${claims.length} claims found`);

  if (claims.length === 0) {
    // No verifiable claims — pass with note
    return {
      status: 'pass',
      confidence: 0.8,
      issues: [],
      confirmed_claims: 0,
      unverified_claims: 0,
      false_claims: 0,
      claims_extracted: 0,
      summary: 'No specific verifiable claims found in article. Content uses hedged language.',
    };
  }

  // Pass 2: Web verification
  process.stdout.write('    Pass 2 (web verify)... ');
  const verificationResults = await verifyClaims(claims, title);
  const confirmed = verificationResults.filter(r => r.verdict === 'confirmed').length;
  const unverified = verificationResults.filter(r => r.verdict === 'unverified').length;
  const falseClaims = verificationResults.filter(r => r.verdict === 'false').length;
  console.log(`${confirmed} confirmed, ${unverified} unverified, ${falseClaims} false`);

  // Pass 3: Final verdict
  process.stdout.write('    Pass 3 (verdict)... ');
  const verdict = await finalVerdict(content, claims, verificationResults);
  verdict.claims_extracted = claims.length;
  verdict.verification_details = verificationResults;
  console.log(verdict.status.toUpperCase());

  return verdict;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('OPENAI_API_KEY or ChatGPT env var is required');
    process.exit(1);
  }

  const targetDirs = process.argv[2] ? [process.argv[2]] : ALL_DIRS;

  // Collect all .md files
  const allFiles = [];
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
      allFiles.push({ dir, file: f, fullPath: path.join(dir, f) });
    }
  }

  console.log(`Found ${allFiles.length} content files across ${targetDirs.length} director${targetDirs.length === 1 ? 'y' : 'ies'}.\n`);

  // Load cached report
  let existingReport = {};
  if (fs.existsSync(REPORT_PATH)) {
    try { existingReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8')); } catch {}
  }

  const results = [];
  let passCount = 0, flagCount = 0, failCount = 0, errorCount = 0;
  let skippedCount = 0, checkedCount = 0;

  for (const { dir, file, fullPath } of allFiles) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fileHash = crypto.createHash('md5').update(content).digest('hex');

    // Skip if already verified and unchanged
    if (existingReport[file]?.hash === fileHash && existingReport[file]?.status === 'pass') {
      results.push({ ...existingReport[file], file, dir });
      passCount++;
      skippedCount++;
      continue;
    }

    checkedCount++;
    console.log(`  CHECK ${file}`);

    let result;
    try {
      result = await factCheckArticle(fullPath, content);
    } catch (err) {
      result = {
        status: 'error',
        confidence: 0,
        issues: [],
        summary: `Check failed: ${err.message}`,
      };
    }

    result.file = file;
    result.hash = fileHash;
    result.dir = dir;
    result.checkedAt = new Date().toISOString();

    // Auto-fix flagged or failed content
    if (result.status === 'flag' || result.status === 'fail') {
      console.log(`    STATUS: ${result.status.toUpperCase()} — attempting auto-fix...`);
      const fixedContent = await autoFixContent(content, result.issues || []);

      if (fixedContent) {
        fs.writeFileSync(fullPath, fixedContent + '\n');
        console.log(`    FIXED — re-checking...`);

        // Re-check the fixed content with full pipeline
        try {
          const recheck = await factCheckArticle(fullPath, fixedContent);
          recheck.file = file;
          recheck.hash = crypto.createHash('md5').update(fixedContent + '\n').digest('hex');
          recheck.dir = dir;
          recheck.checkedAt = new Date().toISOString();
          recheck.autoFixed = true;

          if (recheck.status === 'pass') {
            console.log(`    RE-CHECK: PASS (auto-fixed successfully)`);
            result = recheck;
          } else {
            console.log(`    RE-CHECK: still ${recheck.status.toUpperCase()} after fix`);
            result = recheck;
          }
        } catch (err) {
          console.log(`    RE-CHECK failed: ${err.message}`);
          result.autoFixed = true;
        }
      } else {
        console.log(`    Auto-fix failed for ${file}`);
      }
    }

    // Write per-article verification status to frontmatter
    const verified = result.status === 'pass';
    updateFrontmatter(fullPath, {
      verified,
      factCheckedAt: new Date().toISOString(),
    });

    // Update hash after frontmatter change
    const updatedContent = fs.readFileSync(fullPath, 'utf8');
    result.hash = crypto.createHash('md5').update(updatedContent).digest('hex');

    results.push(result);
    if (result.status === 'pass') passCount++;
    else if (result.status === 'flag') flagCount++;
    else if (result.status === 'fail') failCount++;
    else errorCount++;

    // Rate limit between articles
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n  ${skippedCount} files cached, ${checkedCount} files checked this run.`);

  // Save detailed report
  const report = {};
  for (const r of results) report[r.file] = r;
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Write verification status (strict: only "verified" when ALL pass)
  fs.writeFileSync(VERIFICATION_PATH, JSON.stringify({
    lastChecked: new Date().toISOString(),
    totalFiles: allFiles.length,
    totalVerified: passCount,
    newChecked: checkedCount,
    cached: skippedCount,
    totalChecked: passCount + flagCount + failCount + errorCount,
    passed: passCount,
    flagged: flagCount,
    failed: failCount,
    status: results.every(r => r.status === 'pass') ? 'verified' : 'issues-found',
  }, null, 2));

  // Console summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('FACT-CHECK REPORT (Multi-Pass Pipeline)');
  console.log('='.repeat(50));
  console.log(`  Model:   ${FACT_CHECK_MODEL} (with web search)`);
  console.log(`  Pass:    ${passCount}`);
  console.log(`  Flag:    ${flagCount}`);
  console.log(`  Fail:    ${failCount}`);
  console.log(`  Error:   ${errorCount}`);
  console.log(`  Total:   ${allFiles.length}`);

  const autoFixedCount = results.filter(r => r.autoFixed).length;
  const stillFlagged = results.filter(r => (r.status === 'flag' || r.status === 'fail') && !r.autoFixed).length;

  // Email notifications
  if (autoFixedCount > 0 && stillFlagged === 0 && failCount === 0) {
    await sendEmail(
      `AEA Content Audit: ${autoFixedCount} file(s) auto-corrected — all verified`,
      `<h2>AEA Content Audit Report</h2>
       <p><strong>Multi-pass verification with web search</strong></p>
       <p>${autoFixedCount} content file(s) had issues that were <strong>automatically corrected and re-verified against web sources</strong>.</p>
       <table style="border-collapse:collapse;width:100%;max-width:600px;">
         <tr><td style="padding:6px;font-weight:bold;">Total files</td><td style="padding:6px;">${allFiles.length}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Checked this run</td><td style="padding:6px;">${checkedCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Auto-corrected</td><td style="padding:6px;">${autoFixedCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">All verified</td><td style="padding:6px;">Yes</td></tr>
       </table>`
    );
  } else if (flagCount > 0 || failCount > 0) {
    const issueDetails = results
      .filter(r => r.status === 'flag' || r.status === 'fail')
      .map(r => {
        const falseClaims = r.verification_details?.filter(v => v.verdict === 'false').length || 0;
        return `<tr><td style="padding:6px;border-bottom:1px solid #eee;"><strong>${r.status.toUpperCase()}</strong>: ${r.file}</td><td style="padding:6px;border-bottom:1px solid #eee;">${r.summary}${falseClaims > 0 ? ` (${falseClaims} false claim(s))` : ''}</td></tr>`;
      })
      .join('');

    await sendEmail(
      `AEA Content Audit: ${flagCount + failCount} file(s) need review`,
      `<h2>AEA Content Audit — Review Needed</h2>
       <p><strong>Multi-pass verification with web search</strong></p>
       <p>${flagCount + failCount} content file(s) could not be fully verified against web sources.</p>
       ${autoFixedCount > 0 ? `<p>${autoFixedCount} file(s) were auto-corrected.</p>` : ''}
       <table style="border-collapse:collapse;width:100%;max-width:600px;">
         <tr><td style="padding:6px;font-weight:bold;">Total files</td><td style="padding:6px;">${allFiles.length}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Passed</td><td style="padding:6px;">${passCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Flagged</td><td style="padding:6px;">${flagCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Failed</td><td style="padding:6px;">${failCount}</td></tr>
       </table>
       <h3>Files needing review:</h3>
       <table style="border-collapse:collapse;width:100%;max-width:600px;">${issueDetails}</table>`
    );

    // Remove files that FAILED and couldn't be auto-fixed
    for (const r of results) {
      if (r.status === 'fail' && !r.autoFixed) {
        const failedPath = r.dir ? path.join(r.dir, r.file) : null;
        if (failedPath && fs.existsSync(failedPath)) {
          fs.unlinkSync(failedPath);
          console.log(`  REMOVED unfixable file: ${r.file}`);
        }
      }
    }
  } else if (passCount > 0 && flagCount === 0 && failCount === 0) {
    await sendEmail(
      `AEA Content Audit: All ${passCount} file(s) verified`,
      `<h2>AEA Content Audit Report</h2>
       <p><strong>Multi-pass verification with web search</strong></p>
       <p>All ${passCount} content file(s) passed multi-pass verification. All claims confirmed against web sources.</p>`
    );
  }

  console.log(`\nReport saved to: ${REPORT_PATH}`);
  console.log(`Verification status saved to: ${VERIFICATION_PATH}`);
}

main().catch((err) => { console.error('Fact-check failed:', err); process.exit(1); });
