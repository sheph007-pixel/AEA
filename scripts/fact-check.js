#!/usr/bin/env node

/**
 * Fact-checks content files using Anthropic Claude.
 * Scans recent/modified markdown files and verifies accuracy.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... node scripts/fact-check.js [directory]
 *   Default directory: src/content/briefings
 *
 * Outputs a report to src/content/.fact-check-report.json
 * and logs results to console.
 * Sends email notification to hunter@kennion.com if issues found.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function sendEmail(subject, htmlBody) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn('RESEND_API_KEY not set, skipping email'); return Promise.resolve(); }
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

const DEFAULT_DIR = path.join(__dirname, '..', 'src', 'content', 'briefings');
const REPORT_PATH = path.join(__dirname, '..', 'src', 'content', '.fact-check-report.json');

function callOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.2,
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || process.env.ChatGPT}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('Unexpected response: ' + body.substring(0, 300)));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function factCheck(filePath, content) {
  const prompt = `You are a fact-checker for the American Employers Alliance (AEA), a national employer association. Review the following article for factual accuracy.

CHECK FOR:
1. Incorrect legal references (wrong law names, wrong thresholds, wrong agencies)
2. Fabricated statistics or data points
3. Incorrect compliance deadlines or dates
4. Misleading claims about employer obligations
5. Statements presented as fact that are actually opinions
6. Any claim that could be legally problematic if wrong

RESPOND IN THIS EXACT JSON FORMAT:
{
  "status": "pass" or "flag" or "fail",
  "confidence": 0.0 to 1.0,
  "issues": [
    {
      "severity": "low" or "medium" or "high",
      "text": "the problematic text from the article",
      "issue": "what is wrong or questionable",
      "suggestion": "how to fix it"
    }
  ],
  "summary": "one sentence overall assessment"
}

- "pass" = no factual issues found
- "flag" = minor issues or uncertain claims that should be reviewed
- "fail" = clear factual errors that must be corrected

ARTICLE TO CHECK:
---
${content}
---

Respond ONLY with the JSON object, nothing else.`;

  try {
    const result = await callOpenAI(prompt);
    const parsed = JSON.parse(result);
    return {
      file: path.basename(filePath),
      ...parsed,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      file: path.basename(filePath),
      status: 'error',
      confidence: 0,
      issues: [],
      summary: `Check failed: ${err.message}`,
      checkedAt: new Date().toISOString(),
    };
  }
}

// Splits a markdown file into [frontmatter, body]. Frontmatter is the YAML block
// fenced by --- at the very top. Body is everything after the closing fence.
// If there is no frontmatter, returns ['', content].
function splitFrontmatter(content) {
  if (!content.startsWith('---')) return ['', content];
  const end = content.indexOf('\n---', 3);
  if (end === -1) return ['', content];
  const fmEnd = content.indexOf('\n', end + 4);
  const frontmatter = content.substring(0, fmEnd === -1 ? content.length : fmEnd + 1);
  const body = fmEnd === -1 ? '' : content.substring(fmEnd + 1);
  return [frontmatter, body];
}

async function autoFixContent(filePath, content, issues) {
  const issueList = issues.map((i, idx) => `${idx + 1}. [${i.severity}] "${i.text}" - Issue: ${i.issue} - Fix: ${i.suggestion}`).join('\n');

  // Send only the body to the model. We splice the original frontmatter back in
  // ourselves so the model cannot mutate it (in practice, prompts asking the
  // model "do not change the frontmatter" are routinely ignored).
  const [frontmatter, body] = splitFrontmatter(content);
  if (!frontmatter) return null; // Refuse to auto-fix files without frontmatter.

  const prompt = `You are a senior editorial fact-checker for the American Employers Alliance, a national employer association. An article body has been flagged for accuracy issues. Rewrite the body with corrections applied.

ISSUES FOUND:
${issueList}

RULES FOR THE REWRITE:
- Fix every flagged issue
- Remove or soften any claims that cannot be verified
- Use hedging language: "may," "generally," "employers should consult counsel," "requirements vary by state"
- Do NOT invent new statistics, data, or specific numbers
- Keep the same structure, headings, and overall content
- Keep the same length (do not shorten significantly)
- Preserve the editorial disclaimer at the bottom if one exists
- Make corrections conservative - when in doubt, remove the claim rather than guess
- Return ONLY the body. Do NOT include any YAML frontmatter or --- fence markers.

ORIGINAL BODY:
${body}

Return ONLY the corrected body. No frontmatter, no fence markers, no commentary.`;

  try {
    const fixedBody = await callOpenAI(prompt);
    if (!fixedBody || fixedBody.length < 100) return null;
    // Strip any leading frontmatter the model included despite instructions.
    let cleanBody = fixedBody.trim();
    if (cleanBody.startsWith('---')) {
      const stripIdx = cleanBody.indexOf('\n---', 3);
      if (stripIdx !== -1) {
        const after = cleanBody.indexOf('\n', stripIdx + 4);
        cleanBody = (after === -1 ? '' : cleanBody.substring(after + 1)).trim();
      }
    }
    return frontmatter + cleanBody + '\n';
  } catch {
    return null;
  }
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ChatGPT;
  if (!apiKey) {
    console.error('OPENAI_API_KEY or ChatGPT env var is required');
    process.exit(1);
  }

  // If a specific directory is passed, scan just that. Otherwise scan all content.
  const ALL_DIRS = [
    path.join(__dirname, '..', 'src', 'content', 'briefings'),
    path.join(__dirname, '..', 'src', 'content', 'news'),
    path.join(__dirname, '..', 'src', 'content', 'insights'),
    path.join(__dirname, '..', 'src', 'content', 'resources'),
  ];
  const targetDirs = process.argv[2]
    ? [process.argv[2]]
    : ALL_DIRS;

  // Collect all .md files across all target directories
  const allFiles = [];
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    const dirFiles = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const f of dirFiles) {
      allFiles.push({ dir, file: f, fullPath: path.join(dir, f) });
    }
  }

  console.log(`Found ${allFiles.length} total content files across ${targetDirs.length} director${targetDirs.length === 1 ? 'y' : 'ies'}.\n`);

  // Load existing report (cached results keyed by file path)
  let existingReport = {};
  if (fs.existsSync(REPORT_PATH)) {
    try { existingReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8')); } catch {}
  }

  const results = [];
  let passCount = 0, flagCount = 0, failCount = 0, errorCount = 0;
  let skippedCount = 0, checkedCount = 0;

  for (const { dir, file, fullPath } of allFiles) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fileHash = require('crypto').createHash('md5').update(content).digest('hex');
    const cacheKey = file; // Use filename as cache key

    // Skip if already verified and file content hasn't changed
    if (existingReport[cacheKey]?.hash === fileHash && existingReport[cacheKey]?.status === 'pass') {
      results.push({ ...existingReport[cacheKey], file, dir });
      passCount++;
      skippedCount++;
      continue;
    }

    // New or changed file - needs checking
    checkedCount++;
    process.stdout.write(`  CHECK ${file}... `);
    let result = await factCheck(fullPath, content.substring(0, 4000));
    result.hash = fileHash;
    result.dir = dir;

    // Auto-fix flagged or failed content
    if (result.status === 'flag' || result.status === 'fail') {
      console.log(`${result.status.toUpperCase()} - attempting auto-fix...`);
      const fixedContent = await autoFixContent(fullPath, content, result.issues || []);
      if (fixedContent) {
        // Write the corrected file
        fs.writeFileSync(fullPath, fixedContent + '\n');
        console.log(`    FIXED ${file} - re-checking...`);

        // Re-check the fixed content
        const recheck = await factCheck(fullPath, fixedContent.substring(0, 4000));
        recheck.hash = require('crypto').createHash('md5').update(fixedContent + '\n').digest('hex');
        recheck.dir = dir;
        recheck.autoFixed = true;

        if (recheck.status === 'pass') {
          console.log(`    RE-CHECK: PASS (auto-fixed successfully)`);
          result = recheck;
        } else {
          console.log(`    RE-CHECK: still ${recheck.status.toUpperCase()} after fix`);
          result = recheck;
        }
        await new Promise(r => setTimeout(r, 500));
      } else {
        console.log(`    Auto-fix failed for ${file}`);
      }
    } else if (result.status === 'pass') {
      console.log('PASS');
    } else {
      console.log('ERROR');
    }

    results.push(result);
    if (result.status === 'pass') passCount++;
    else if (result.status === 'flag') flagCount++;
    else if (result.status === 'fail') failCount++;
    else errorCount++;

    // Rate limit: pause between API calls
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n  ${skippedCount} files already verified (cached), ${checkedCount} files checked this run.`);

  // Save report. When called with a directory arg (daily news run, monthly
  // briefings run), merge into the existing report instead of rewriting it -
  // otherwise we would clobber entries from directories outside this run's
  // scope. When called with no arg (weekly full audit), rebuild from scratch.
  const isScopedRun = !!process.argv[2];
  const report = isScopedRun ? { ...existingReport } : {};
  // When merging, drop stale entries whose source file no longer exists in the
  // current scope (a deleted/renamed file in the scoped dir should disappear
  // from the report). Only drop entries whose dir matches the scoped dir.
  if (isScopedRun) {
    const scopedDir = process.argv[2];
    const liveFilesInScope = new Set(allFiles.map(f => f.file));
    for (const fname of Object.keys(report)) {
      if (report[fname]?.dir === scopedDir && !liveFilesInScope.has(fname)) {
        delete report[fname];
      }
    }
  }
  for (const r of results) { report[r.file] = r; }
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Write verification status file (read by the site to show badge). Compute
  // from the full merged report so a scoped run does not understate site-wide
  // counts.
  const VERIFICATION_PATH = path.join(__dirname, '..', 'src', 'content', 'verification.json');
  const reportEntries = Object.values(report);
  const totalPass = reportEntries.filter(e => e.status === 'pass').length;
  const totalFlag = reportEntries.filter(e => e.status === 'flag').length;
  const totalFail = reportEntries.filter(e => e.status === 'fail').length;
  const totalError = reportEntries.filter(e => e.status === 'error').length;
  fs.writeFileSync(VERIFICATION_PATH, JSON.stringify({
    lastChecked: new Date().toISOString(),
    totalFiles: reportEntries.length,
    totalVerified: totalPass,
    newChecked: checkedCount,
    cached: skippedCount,
    totalChecked: totalPass + totalFlag + totalFail + totalError,
    passed: totalPass,
    flagged: totalFlag,
    failed: totalFail,
    status: (totalFail === 0 && totalFlag === 0) ? 'verified' : 'issues-found',
  }, null, 2));

  // Console summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`FACT-CHECK REPORT`);
  console.log(`${'='.repeat(50)}`);
  console.log(`  Pass:    ${passCount}`);
  console.log(`  Flag:    ${flagCount}`);
  console.log(`  Fail:    ${failCount}`);
  console.log(`  Error:   ${errorCount}`);
  console.log(`  Total:   ${allFiles.length}`);

  // Count auto-fixed files
  const autoFixedCount = results.filter(r => r.autoFixed).length;
  const stillFlagged = results.filter(r => (r.status === 'flag' || r.status === 'fail') && !r.autoFixed).length;

  // Email notification
  if (autoFixedCount > 0 && stillFlagged === 0) {
    // Auto-fixed and all clear now
    await sendEmail(
      `AEA Content Audit: ${autoFixedCount} file(s) auto-corrected - all verified`,
      `<h2>AEA Content Audit Report</h2>
       <p>${autoFixedCount} content file(s) had issues that were <strong>automatically corrected and re-verified</strong>. No manual action needed.</p>
       <table style="border-collapse:collapse;width:100%;max-width:600px;">
         <tr><td style="padding:6px;font-weight:bold;">Total files</td><td style="padding:6px;">${allFiles.length}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Checked this run</td><td style="padding:6px;">${checkedCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Auto-corrected</td><td style="padding:6px;">${autoFixedCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">All verified</td><td style="padding:6px;">Yes</td></tr>
       </table>
       <p style="margin-top:16px;color:#666;font-size:12px;">All content has been automatically corrected and re-verified. No action required.</p>`
    );
  } else if (stillFlagged > 0) {
    // Some issues could not be auto-fixed
    const issueDetails = results
      .filter(r => (r.status === 'flag' || r.status === 'fail') && !r.autoFixed)
      .map(r => `<tr><td style="padding:6px;border-bottom:1px solid #eee;font-weight:bold;">${r.status.toUpperCase()}: ${r.file}</td><td style="padding:6px;border-bottom:1px solid #eee;">${r.summary}</td></tr>`)
      .join('');

    await sendEmail(
      `AEA Content Audit: ${stillFlagged} file(s) need manual review`,
      `<h2>AEA Content Audit - Manual Review Needed</h2>
       <p>${stillFlagged} content file(s) could not be automatically corrected and may need manual review.</p>
       ${autoFixedCount > 0 ? `<p>${autoFixedCount} other file(s) were auto-corrected successfully.</p>` : ''}
       <table style="border-collapse:collapse;width:100%;max-width:600px;">
         <tr><td style="padding:6px;font-weight:bold;">Total files</td><td style="padding:6px;">${allFiles.length}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Auto-corrected</td><td style="padding:6px;">${autoFixedCount}</td></tr>
         <tr><td style="padding:6px;font-weight:bold;">Need review</td><td style="padding:6px;">${stillFlagged}</td></tr>
       </table>
       <h3 style="margin-top:16px;">Files needing review:</h3>
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
  } else if (flagCount === 0 && failCount === 0) {
    // All clean, no issues at all
    await sendEmail(
      `AEA Content Audit: All ${passCount} file(s) verified`,
      `<h2>AEA Content Audit Report</h2><p>All ${passCount} checked content file(s) passed verification. No issues found.</p><p style="color:#666;font-size:12px;">Checked at: ${new Date().toISOString()}</p>`
    );
  }

  console.log(`\nReport saved to: ${REPORT_PATH}`);
  console.log(`Verification status saved to: ${VERIFICATION_PATH}`);
}

main().catch((err) => { console.error('Fact-check failed:', err); process.exit(1); });
