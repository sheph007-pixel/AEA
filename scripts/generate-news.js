#!/usr/bin/env node

/**
 * Generates 5 daily news articles for the AEA Employer News section.
 * Uses OpenAI to create timely, relevant articles for HR/business owners.
 *
 * Usage: OPENAI_API_KEY=sk-... node scripts/generate-news.js
 *
 * Designed to run daily via GitHub Actions. Keeps only the latest 30 articles
 * to keep the news section fresh and the build fast.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const costGuard = require('./lib/cost-guard');

const SCRIPT_NAME = 'generate-news';

// Model selection. Default to gpt-4o for quality. Set OPENAI_NEWS_MODEL to
// override (e.g., 'gpt-4o-mini' for cost savings).
const MODEL = process.env.OPENAI_NEWS_MODEL || process.env.OPENAI_MODEL || 'gpt-4o';

const NEWS_DIR = path.join(__dirname, '..', 'src', 'content', 'news');

const CATEGORIES = [
  'Employment Law',
  'HR Trends',
  'Workplace Policy',
  'Business Operations',
  'Benefits & Compensation',
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function todayFormatted() {
  return new Date().toISOString().split('T')[0];
}

function callOpenAI(prompt) {
  costGuard.assertCanCall(SCRIPT_NAME);
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You write workplace-law news for the American Employers Alliance. Your readers are HR directors, business owners, and in-house counsel of companies with 2-500 employees. They have limited time and zero patience for filler.

VOICE:
- Lead with the news, not the framing. The first sentence should state what happened, who is affected, and when.
- Plain English. Short sentences. Active voice.
- Cite specifics: agency, statute name, section number, court name, case name, effective date, dollar threshold.
- 400-700 words is the right length. Short and sharp beats long and padded.

FORBIDDEN AI TELLS - do not use any of these phrases:
- "navigating the [X] landscape" / "evolving landscape"
- "in today's [anything]"
- "as we move into" / "as we move forward"
- "stay informed" / "stay vigilant"
- "employers should be aware" / "it is important to note"
- "may want to consider" - if it's worth saying, say it as a direct recommendation
- "robust" / "comprehensive" / "holistic" / "leverage" / "unlock"
- "fostering a culture of"
- Generic openers: "In recent years..." / "More than ever before..."

REQUIRED:
- A specific, dated, factual hook. Not "regulators are watching AI" but "the EEOC issued guidance on [date]" or "Colorado's AI Act takes effect June 30, 2026."
- Concrete employer action items - not "review your policies" but "audit Form I-9 records pulled in the last 12 months" or "amend offer letters before [date]."
- Real laws by section: "FLSA exempt threshold of $684/week (29 U.S.C. § 213(a)(1))" beats "the FLSA salary threshold."

NEVER invent statistics, court cases, agency announcements, dollar figures, or quotes. Never cite as current a rule that has been vacated or struck down. The 2024 FLSA overtime rule was vacated November 15, 2024 (current threshold reverted to $684/week / $35,568/year). The FTC noncompete rule was struck down August 20, 2024 in Ryan LLC v. FTC and never took effect.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1800,
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
          if (parsed.usage) costGuard.recordUsage(SCRIPT_NAME, parsed.usage);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('Unexpected API response: ' + body.substring(0, 300)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getExistingTitles() {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const content = fs.readFileSync(path.join(NEWS_DIR, f), 'utf8');
      const match = content.match(/title:\s*"([^"]+)"/);
      return match ? match[1] : '';
    })
    .filter(Boolean);
}

function isTooSimilar(newTitle, existingTitles) {
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).sort().join(' ');
  const newNorm = normalize(newTitle);
  for (const existing of existingTitles) {
    const existNorm = normalize(existing);
    // Check if the key words overlap heavily
    const newWords = new Set(newNorm.split(' ').filter((w) => w.length > 3));
    const existWords = new Set(existNorm.split(' ').filter((w) => w.length > 3));
    const overlap = [...newWords].filter((w) => existWords.has(w)).length;
    const maxLen = Math.max(newWords.size, existWords.size);
    if (maxLen > 0 && overlap / maxLen > 0.7) return true;
  }
  return false;
}

async function generateArticle(category, index, existingTitles) {
  const date = todayFormatted();

  const avoidList =
    existingTitles.length > 0
      ? `\n\nIMPORTANT: Do NOT write about topics already covered. Avoid these existing headlines:\n${existingTitles.map((t) => `- ${t}`).join('\n')}\n\nChoose a substantially DIFFERENT topic within the "${category}" category.`
      : '';

  const prompt = `Write a short news article (400-500 words) about a current topic in "${category}" that employers and HR professionals would find useful and want to read today.

The article should:
- Cover a real, current topic (regulatory changes, workplace trends, legal developments, HR best practices)
- Be written as a news/analysis piece, not a how-to guide
- Include what employers need to know and any action items
- Reference real laws, agencies, or regulations where relevant
- NOT invent specific statistics, company names, or quotes${avoidList}

Output the article in this EXACT markdown format (nothing else before or after):

---
title: "Headline Here"
description: "One sentence summary under 160 chars."
category: "${category}"
date: "${date}"
author: "AEA Editorial Team"
verified: false
---

## First Section

Content here...`;

  const content = await callOpenAI(prompt);

  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : `${category} Update`;

  if (isTooSimilar(title, existingTitles)) {
    console.log(`Skipped (too similar to existing): ${title}`);
    return null;
  }

  const slug = `${date}-${slugify(title)}-${index}`;

  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Created: ${slug}`);
  return title;
}

function cleanOldNews() {
  if (!fs.existsSync(NEWS_DIR)) return;
  const files = fs.readdirSync(NEWS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  // Keep only the latest 30 articles
  const toDelete = files.slice(30);
  for (const file of toDelete) {
    fs.unlinkSync(path.join(NEWS_DIR, file));
    console.log(`Cleaned old: ${file}`);
  }
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ChatGPT;
  if (!apiKey) {
    console.error('OPENAI_API_KEY or ChatGPT env var is required');
    process.exit(1);
  }

  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
  }

  console.log('Generating 5 daily news articles...');

  const existingTitles = getExistingTitles();
  console.log(`Found ${existingTitles.length} existing articles to check against.`);

  for (let i = 0; i < 5; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    try {
      const newTitle = await generateArticle(category, i, existingTitles);
      if (newTitle) existingTitles.push(newTitle);
    } catch (err) {
      if (err && err.code === 'COST_GUARD_TRIPPED') {
        console.warn(`[cost-guard] ${err.message}`);
        console.warn('[cost-guard] Halting news generation. The next scheduled run will resume normally.');
        break;
      }
      console.error(`Failed to generate article ${i}:`, err.message);
    }
  }

  cleanOldNews();
  costGuard.logSummary(SCRIPT_NAME);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
