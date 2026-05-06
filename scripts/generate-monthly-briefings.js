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

  // Build clean slug: ${ym}-${type}-${variableTitlePart}
  // The AI's title typically begins with a fixed prefix that matches the type
  // (e.g. "Monthly Employer Briefing: May 2026"). Strip that prefix so the
  // slug is "2026-05-monthly-briefing" not "2026-05-monthly-briefing-monthly-employer-briefing-may-2026".
  // We strip everything before/including the first colon, then slugify the remainder.
  const variablePart = title.includes(':') ? title.split(':').slice(1).join(':').trim() : '';
  const variableSlug = slugify(variablePart);
  // For monthly-briefing / employer-questions where the title is just "X: {Month Year}",
  // the variable part is just the month — drop it since ${ym} already encodes the month.
  const monthSlug = slugify(month); // e.g. "may-2026"
  const dropVariable = !variableSlug || variableSlug === monthSlug;
  const slug = dropVariable ? `${ym}-${type}` : `${ym}-${type}-${variableSlug}`;

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

  const SHARED_SOURCING_RULES = `
SOURCING REQUIREMENTS (critical - this is for an employer association, not a blog):
- Cite real, named regulations, statutes, or agency announcements (FLSA, FMLA, ADA, OSHA, ERISA, ACA, COBRA, USERRA, NLRB, EEOC, DOL, IRS, FTC, etc.).
- When you cite a deadline, give a specific calendar date that occurs in or near ${ctx.month}.
- When you cite a state law, name the state and the actual statute or bill number where one exists.
- Do NOT invent court cases, agency announcements, comment periods, or rule effective dates.
- Do NOT reference comment periods or proposed rules from prior years as if they are current news.
- The 2024 FLSA overtime rule was vacated by a Texas federal court in November 2024; the standard salary threshold reverted to $684/week / $35,568/year. Do not state the 2024 rule as if it is in effect.
- The FTC noncompete rule (final April 2024) was struck down by a Texas federal court in August 2024 and never took effect.
- If you do not have a verifiable, current item to include, omit that section rather than fill it with vague hedged language.

QUALITY BAR:
- Every "Key Development" or "Compliance Deadline" must include either (a) a specific calendar date, (b) a named statute / regulation / form number, or (c) a named agency action. Items that are pure generality ("employers should stay informed about evolving FMLA interpretations") are NOT acceptable - drop them.
- Action items must be concrete steps an employer can take this month, not generic encouragement.
`;

  // 1. Monthly Employer Briefing
  await generate('monthly-briefing', `Write the Monthly Employer Briefing for ${ctx.month}. Cover 3-5 key developments employers should know about this month: regulatory changes, compliance deadlines, workforce trends, and practical action items.

${SHARED_SOURCING_RULES}

Output in this exact format:
---
title: "Monthly Employer Briefing: ${ctx.month}"
description: "Key compliance changes, workplace trends, and employer action items for ${ctx.month}."
type: "monthly-briefing"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["monthly briefing", "compliance", "employer update"]
verified: false
---

## Key Developments This Month
(only include items that pass the QUALITY BAR above)
## Compliance Deadlines
(specific dates only - skip if you do not have a verifiable deadline this month)
## Employer Action Items
(concrete, actionable steps tied to the items above)
## Looking Ahead
(real upcoming dates / known rulemakings - skip if nothing concrete)`, ctx);

  // 2. Compliance Alert
  await generate('compliance-alert', `Write a Compliance Alert about a specific, real regulatory requirement or deadline relevant to employers this month (${ctx.month}). Focus on ONE topic: a filing deadline, a new state law taking effect this month, an OSHA requirement, ACA reporting, or similar. The topic must have a specific calendar date in or near ${ctx.month}.

${SHARED_SOURCING_RULES}

Output format:
---
title: "Compliance Alert: [Specific Topic]"
description: "One sentence about the compliance issue."
type: "compliance-alert"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["compliance", "alert"]
verified: false
---

## What Changed
## Who Is Affected
## What Employers Should Do
## Key Deadlines`, ctx);

  // 3. Trends Report
  await generate('trends-report', `Write an Employer Trends Report for ${ctx.month}. Cover 2-3 workplace or employment trends that employers with 2-500 employees should be aware of. Use general industry observations, NOT AEA member data.

${SHARED_SOURCING_RULES}

Output format:
---
title: "Employer Trends: [Topic Focus]"
description: "One sentence overview."
type: "trends-report"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["trends", "workforce"]
verified: false
---

Content with ## headings.`, ctx);

  // 4. Industry Snapshot
  await generate('industry-snapshot', `Write an Industry Snapshot focused on the ${industry} industry for ${ctx.month}. Cover employment challenges, compliance considerations, and practical guidance specific to ${industry} employers with 2-500 employees. Use only publicly available information.

${SHARED_SOURCING_RULES}

Output format:
---
title: "Industry Snapshot: ${industry} Employer Considerations"
description: "One sentence overview."
type: "industry-snapshot"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["industry", "${industry.toLowerCase()}"]
verified: false
---

Content with ## headings.`, ctx);

  // 5. What Employers Are Asking
  await generate('employer-questions', `Write "What Employers Are Asking: ${ctx.month}" - 4-5 common questions that employers with 2-500 employees typically face this time of year, with brief practical answers. Frame as "common questions employers face" NOT "questions our members asked."

${SHARED_SOURCING_RULES}

Output format:
---
title: "What Employers Are Asking: ${ctx.month}"
description: "Common employer questions and practical answers for ${ctx.month}."
type: "employer-questions"
date: "${ctx.date}"
month: "${ctx.ym}"
author: "AEA Editorial Team"
tags: ["employer questions", "FAQ"]
verified: false
---

## Q: [Question 1]
Answer...

## Q: [Question 2]
Answer...`, ctx);

  console.log('Done! 5 briefings generated.');
}

main().catch((err) => { console.error('Failed:', err); process.exit(1); });
