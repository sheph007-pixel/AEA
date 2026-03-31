#!/usr/bin/env node

/**
 * Generates 5 monthly institutional briefing articles for the AEA website.
 * Runs on the 1st of each month via GitHub Actions.
 *
 * Usage: OPENAI_API_KEY=sk-... node scripts/generate-monthly-briefings.js
 *        Or: ChatGPT=sk-... node scripts/generate-monthly-briefings.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BRIEFINGS_DIR = path.join(__dirname, '..', 'src', 'content', 'briefings');

const INDUSTRIES = [
  'Healthcare', 'Retail', 'Manufacturing', 'Construction', 'Technology',
  'Hospitality', 'Professional Services', 'Transportation', 'Education', 'Nonprofits',
];

const EDITORIAL_NOTE = `\n\n---\n\n*This briefing is prepared by the AEA Editorial Team based on publicly available regulatory guidance, employment law developments, and employer-reported trends. Individual data from AEA members is never disclosed. All analysis reflects general observations and should not be treated as legal advice. Consult qualified counsel for guidance on specific situations.*\n`;

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
}

function getMonthYear() {
  const d = new Date();
  const month = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const ym = d.toISOString().substring(0, 7);
  const date = d.toISOString().split('T')[0];
  return { month, ym, date };
}

function callOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a senior editorial writer for the American Employers Alliance (AEA), a national employer association founded in 2013 that serves businesses with 2-500 employees across all industries.

Write in an institutional, authoritative tone. You are preparing official association publications.

CRITICAL RULES:
- Never invent statistics, survey results, member counts, or proprietary data
- Never fabricate legal citations or case names
- Use careful language: "may," "consider," "employers should be aware," "consult counsel"
- Reference real laws by name (FMLA, ADA, FLSA, OSHA, Title VII, COBRA, ACA) where relevant
- Frame trend observations as general industry observations, not AEA member data
- Every piece must be factually defensible and privacy-safe
- Do not reference specific companies, named individuals, or AEA member organizations`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.5,
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

async function generate(type, prompt, { month, ym, date }) {
  console.log(`Generating: ${type}...`);
  const content = await callOpenAI(prompt);
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : `${type} - ${month}`;
  const slug = `${ym}-${type}-${slugify(title)}`;
  const filePath = path.join(BRIEFINGS_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, content.trim() + EDITORIAL_NOTE);
  console.log(`  Created: ${slug}.md`);
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ChatGPT;
  if (!apiKey) { console.error('OPENAI_API_KEY or ChatGPT required'); process.exit(1); }
  if (!fs.existsSync(BRIEFINGS_DIR)) fs.mkdirSync(BRIEFINGS_DIR, { recursive: true });

  const ctx = getMonthYear();
  const industry = INDUSTRIES[new Date().getMonth() % INDUSTRIES.length];

  // 1. Monthly Employer Briefing
  await generate('monthly-briefing', `Write the Monthly Employer Briefing for ${ctx.month}. Cover 3-5 key developments employers should know about this month: regulatory changes, compliance deadlines, workforce trends, and practical action items.

Output in this exact format:
---
title: "Monthly Employer Briefing: ${ctx.month}"
description: "Key compliance changes, workplace trends, and employer action items for ${ctx.month}."
type: "monthly-briefing"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["monthly briefing", "compliance", "employer update"]
---

## Key Developments This Month
...
## Compliance Deadlines
...
## Employer Action Items
...
## Looking Ahead
...`, ctx);

  // 2. Compliance Alert
  await generate('compliance-alert', `Write a Compliance Alert about a specific, real regulatory requirement or deadline relevant to employers this month (${ctx.month}). Focus on one topic: a filing deadline, a new state law taking effect, an OSHA requirement, ACA reporting, or similar.

Output format:
---
title: "Compliance Alert: [Specific Topic]"
description: "One sentence about the compliance issue."
type: "compliance-alert"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["compliance", "alert"]
---

## What Changed
...
## Who Is Affected
...
## What Employers Should Do
...
## Key Deadlines
...`, ctx);

  // 3. Trends Report
  await generate('trends-report', `Write an Employer Trends Report for ${ctx.month}. Cover 2-3 workplace or employment trends that employers with 2-500 employees should be aware of. Use general industry observations, NOT AEA member data.

Output format:
---
title: "Employer Trends: [Topic Focus]"
description: "One sentence overview."
type: "trends-report"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["trends", "workforce"]
---

Content with ## headings...`, ctx);

  // 4. Industry Snapshot
  await generate('industry-snapshot', `Write an Industry Snapshot focused on the ${industry} industry for ${ctx.month}. Cover employment challenges, compliance considerations, and practical guidance specific to ${industry} employers with 2-500 employees. Use only publicly available information.

Output format:
---
title: "Industry Snapshot: ${industry} Employer Considerations"
description: "One sentence overview."
type: "industry-snapshot"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["industry", "${industry.toLowerCase()}"]
---

Content with ## headings...`, ctx);

  // 5. What Employers Are Asking
  await generate('employer-questions', `Write "What Employers Are Asking: ${ctx.month}" — 4-5 common questions that employers with 2-500 employees typically face this time of year, with brief practical answers. Frame as "common questions employers face" NOT "questions our members asked."

Output format:
---
title: "What Employers Are Asking: ${ctx.month}"
description: "Common employer questions and practical answers for ${ctx.month}."
type: "employer-questions"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["employer questions", "FAQ"]
---

## Q: [Question 1]
Answer...

## Q: [Question 2]
Answer...`, ctx);

  console.log('Done! 5 briefings generated.');
}

main().catch((err) => { console.error('Failed:', err); process.exit(1); });
