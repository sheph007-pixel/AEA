#!/usr/bin/env node

/**
 * Generates a new employer-focused article as a markdown file.
 * Uses the Anthropic API to create unique, accurate content.
 *
 * Usage: ANTHROPIC_API_KEY=sk-... node scripts/generate-article.js
 *
 * This script is designed to run in a GitHub Actions cron job
 * to continuously add fresh content to the AEA site.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CATEGORIES = [
  'Compliance',
  'HR Management',
  'Hiring',
  'Operations',
  'Workplace Culture',
  'Benefits',
  'Leadership',
  'Safety',
  'Technology',
  'Small Business',
];

const TOPICS = [
  'employment law updates',
  'HR best practices for small businesses',
  'hiring and recruitment strategies',
  'workplace compliance requirements',
  'employee benefits administration',
  'workplace safety programs',
  'employee retention techniques',
  'payroll and tax compliance',
  'remote and hybrid work management',
  'performance management systems',
  'employee handbook policies',
  'workers compensation management',
  'workplace culture development',
  'leadership skills for managers',
  'small business operations',
  'termination and offboarding procedures',
  'workplace technology tools',
  'employee training and development',
  'wage and hour compliance',
  'multi-state employment regulations',
  'workplace harassment prevention',
  'ADA accommodation processes',
  'FMLA administration',
  'I-9 compliance',
  'unemployment insurance management',
  'employee engagement strategies',
  'succession planning',
  'conflict resolution in the workplace',
  'data privacy for employers',
  'business continuity planning',
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function todayFormatted() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function callAnthropic(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
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
            reject(new Error('Unexpected API response: ' + body.substring(0, 200)));
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

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is required');
    process.exit(1);
  }

  // Check existing articles to avoid duplicates
  const resourcesDir = path.join(__dirname, '..', 'src', 'content', 'resources');
  const existing = fs.readdirSync(resourcesDir).map((f) => f.replace('.md', ''));

  const category = getRandomItem(CATEGORIES);
  const topic = getRandomItem(TOPICS);
  const date = todayFormatted();

  const prompt = `Write a practical employer-focused article for the American Employers Alliance website.

Topic area: ${topic}
Category: ${category}

Requirements:
- Write 500-700 words of accurate, practical guidance for employers with 2-500 employees
- Use clear headings (## and ###) to organize the content
- Include specific, actionable steps employers can take
- Reference relevant laws or regulations where applicable (FLSA, FMLA, ADA, OSHA, etc.)
- Do NOT invent statistics, quotes, case studies, or partnerships
- Write in a professional, direct style suitable for a business publication
- The content must be factually accurate

Output ONLY the article in this exact format (no other text before or after):

---
title: "Article Title Here"
description: "One sentence description under 160 characters."
category: "${category}"
date: "${date}"
tags: ["tag1", "tag2", "tag3"]
author: "AEA Editorial Team"
---

## First Section

Content here...`;

  console.log(`Generating article: ${category} / ${topic}`);

  const content = await callAnthropic(prompt);

  // Extract title from frontmatter for slug
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : `${category}-${topic}`;
  let slug = slugify(title);

  // Ensure unique slug
  if (existing.includes(slug)) {
    slug = slug + '-' + Date.now().toString(36).slice(-4);
  }

  const filePath = path.join(resourcesDir, `${slug}.md`);
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Created: ${filePath}`);
  console.log(`Slug: ${slug}`);
  console.log(`Category: ${category}`);
}

main().catch((err) => {
  console.error('Failed to generate article:', err);
  process.exit(1);
});
