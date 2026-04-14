#!/usr/bin/env node

/**
 * Resets all articles to unchecked state: verified: false, no factCheckedAt.
 * Articles without factCheckedAt will still appear on the site (unchecked = visible).
 * Only articles that have been fact-checked AND failed get hidden.
 *
 * After running this, trigger the Weekly Content Audit workflow in GitHub Actions
 * to run the real fact-checker with the OpenAI API.
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIRS = [
  path.join(__dirname, '..', 'src', 'content', 'news'),
  path.join(__dirname, '..', 'src', 'content', 'briefings'),
  path.join(__dirname, '..', 'src', 'content', 'resources'),
  path.join(__dirname, '..', 'src', 'content', 'insights'),
];

let updated = 0;

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Set verified: false
    if (/^verified: true$/m.test(content)) {
      content = content.replace(/^verified: true$/m, 'verified: false');
      changed = true;
    }

    // Remove factCheckedAt if present (means it hasn't been checked by the new pipeline)
    if (/^factCheckedAt:.*$/m.test(content)) {
      content = content.replace(/^factCheckedAt:.*\n/m, '');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(fullPath, content);
      updated++;
    }
  }
}

console.log(`Reset ${updated} files to unchecked state (verified: false, no factCheckedAt).`);
console.log('These articles will still appear on the site until the fact-checker runs.');
console.log('Trigger the Weekly Content Audit workflow in GitHub Actions to verify them.');
