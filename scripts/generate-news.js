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
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional business journalist writing for an employer association. Write accurate, practical news articles for HR professionals and business owners of companies with 2-500 employees. Never invent statistics, quotes, or specific company names. Focus on what employers need to know and what actions they should take.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
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

async function generateArticle(category, index) {
  const date = todayFormatted();

  const prompt = `Write a short news article (400-500 words) about a current topic in "${category}" that employers and HR professionals would find useful and want to read today.

The article should:
- Cover a real, current topic (regulatory changes, workplace trends, legal developments, HR best practices)
- Be written as a news/analysis piece, not a how-to guide
- Include what employers need to know and any action items
- Reference real laws, agencies, or regulations where relevant
- NOT invent specific statistics, company names, or quotes

Output the article in this EXACT markdown format (nothing else before or after):

---
title: "Headline Here"
description: "One sentence summary under 160 chars."
category: "${category}"
date: "${date}"
author: "AEA Editorial Team"
---

## First Section

Content here...`;

  const content = await callOpenAI(prompt);

  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : `${category} Update`;
  const slug = `${date}-${slugify(title)}-${index}`;

  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Created: ${slug}`);
  return slug;
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

  for (let i = 0; i < 5; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    try {
      await generateArticle(category, i);
    } catch (err) {
      console.error(`Failed to generate article ${i}:`, err.message);
    }
  }

  cleanOldNews();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
