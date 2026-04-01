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
    const result = await factCheck(fullPath, content.substring(0, 4000));
    result.hash = fileHash;
    result.dir = dir;
    results.push(result);

    if (result.status === 'pass') { passCount++; console.log('PASS'); }
    else if (result.status === 'flag') { flagCount++; console.log(`FLAG (${result.issues.length} issues)`); }
    else if (result.status === 'fail') { failCount++; console.log(`FAIL (${result.issues.length} issues)`); }
    else { errorCount++; console.log('ERROR'); }

    // Rate limit: pause between API calls
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n  ${skippedCount} files already verified (cached), ${checkedCount} files checked this run.`);

  // Save report
  const report = {};
  for (const r of results) { report[r.file] = r; }
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Write verification status file (read by the site to show badge)
  const VERIFICATION_PATH = path.join(__dirname, '..', 'src', 'content', 'verification.json');
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
    status: failCount === 0 ? 'verified' : 'issues-found',
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

  // Email notification if issues found
  if (flagCount > 0 || failCount > 0) {
    const issueDetails = results
      .filter(r => r.status === 'flag' || r.status === 'fail')
      .map(r => `<tr><td style="padding:6px;border-bottom:1px solid #eee;font-weight:bold;">${r.status.toUpperCase()}: ${r.file}</td><td style="padding:6px;border-bottom:1px solid #eee;">${r.summary}</td></tr>`)
      .join('');

    const emailBody = `<h2>AEA Fact-Check Alert</h2>
      <p>The automated fact-checker found issues in ${flagCount + failCount} content file(s).</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:6px;font-weight:bold;">Pass</td><td style="padding:6px;">${passCount}</td></tr>
        <tr><td style="padding:6px;font-weight:bold;">Flagged</td><td style="padding:6px;">${flagCount}</td></tr>
        <tr><td style="padding:6px;font-weight:bold;">Failed</td><td style="padding:6px;">${failCount}</td></tr>
      </table>
      <h3 style="margin-top:16px;">Issues:</h3>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">${issueDetails}</table>
      <p style="margin-top:16px;color:#666;font-size:12px;">Review the content before it goes live.</p>`;

    await sendEmail(
      `AEA Fact-Check: ${failCount > 0 ? 'FAILED' : 'FLAGGED'} - ${flagCount + failCount} issue(s) found`,
      emailBody
    );

    console.log(`\nNotification sent to hunter@kennion.com`);

    // Log issue details to console
    for (const r of results) {
      if (r.status === 'flag' || r.status === 'fail') {
        console.log(`\n  ${r.status.toUpperCase()}: ${r.file}`);
        console.log(`  Summary: ${r.summary}`);
        for (const issue of r.issues) {
          console.log(`    [${issue.severity}] ${issue.issue}`);
          if (issue.suggestion) console.log(`           Fix: ${issue.suggestion}`);
        }
      }
    }

    // Remove files that FAILED fact-check (don't publish bad content)
    for (const r of results) {
      if (r.status === 'fail') {
        const failedPath = r.dir ? path.join(r.dir, r.file) : null;
        if (failedPath && fs.existsSync(failedPath)) {
          fs.unlinkSync(failedPath);
          console.log(`  REMOVED failed file: ${r.file}`);
        }
      }
    }
  } else {
    // All passed - send success confirmation
    await sendEmail(
      `AEA Fact-Check: All Clear - ${passCount} file(s) verified`,
      `<h2>AEA Fact-Check Report</h2><p>All ${passCount} checked content file(s) passed verification. No issues found.</p><p style="color:#666;font-size:12px;">Checked at: ${new Date().toISOString()}</p>`
    );
  }

  console.log(`\nReport saved to: ${REPORT_PATH}`);
  console.log(`Verification status saved to: ${VERIFICATION_PATH}`);
}

main().catch((err) => { console.error('Fact-check failed:', err); process.exit(1); });
