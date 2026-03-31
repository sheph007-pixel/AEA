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
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DEFAULT_DIR = path.join(__dirname, '..', 'src', 'content', 'briefings');
const REPORT_PATH = path.join(__dirname, '..', 'src', 'content', '.fact-check-report.json');

function callAnthropic(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.content && parsed.content[0]) {
            resolve(parsed.content[0].text);
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
    const result = await callAnthropic(prompt);
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
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is required');
    process.exit(1);
  }

  const targetDir = process.argv[2] || DEFAULT_DIR;
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(targetDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .slice(0, 20); // Check up to 20 most recent files

  console.log(`Fact-checking ${files.length} files in ${targetDir}...\n`);

  // Load existing report
  let existingReport = {};
  if (fs.existsSync(REPORT_PATH)) {
    try { existingReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8')); } catch {}
  }

  const results = [];
  let passCount = 0, flagCount = 0, failCount = 0, errorCount = 0;

  for (const file of files) {
    const filePath = path.join(targetDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if already checked and file hasn't changed
    const fileHash = require('crypto').createHash('md5').update(content).digest('hex');
    if (existingReport[file]?.hash === fileHash && existingReport[file]?.status === 'pass') {
      console.log(`  SKIP  ${file} (already verified)`);
      results.push({ ...existingReport[file], file });
      passCount++;
      continue;
    }

    process.stdout.write(`  CHECK ${file}... `);
    const result = await factCheck(filePath, content.substring(0, 4000));
    result.hash = fileHash;
    results.push(result);

    if (result.status === 'pass') { passCount++; console.log('PASS'); }
    else if (result.status === 'flag') { flagCount++; console.log(`FLAG (${result.issues.length} issues)`); }
    else if (result.status === 'fail') { failCount++; console.log(`FAIL (${result.issues.length} issues)`); }
    else { errorCount++; console.log('ERROR'); }

    // Rate limit: brief pause between checks
    await new Promise(r => setTimeout(r, 500));
  }

  // Save report
  const report = {};
  for (const r of results) { report[r.file] = r; }
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Console summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`FACT-CHECK REPORT`);
  console.log(`${'='.repeat(50)}`);
  console.log(`  Pass:    ${passCount}`);
  console.log(`  Flag:    ${flagCount}`);
  console.log(`  Fail:    ${failCount}`);
  console.log(`  Error:   ${errorCount}`);
  console.log(`  Total:   ${files.length}`);

  if (flagCount > 0 || failCount > 0) {
    console.log(`\nISSUES FOUND:`);
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
  }

  console.log(`\nReport saved to: ${REPORT_PATH}`);

  // Exit with error code if any failures
  if (failCount > 0) process.exit(1);
}

main().catch((err) => { console.error('Fact-check failed:', err); process.exit(1); });
