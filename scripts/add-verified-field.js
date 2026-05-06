#!/usr/bin/env node

/**
 * One-time migration: adds `verified: false` to all existing content
 * files that don't already have a `verified` field in their frontmatter.
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
let skipped = 0;

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check if verified field already exists
    if (/^verified:/m.test(content)) {
      skipped++;
      continue;
    }

    // Insert verified: false before the closing --- of frontmatter
    const updatedContent = content.replace(
      /^(---\n[\s\S]*?)(---)/m,
      (match, frontmatter, closing) => {
        // Add verified: false before the closing ---
        return frontmatter.trimEnd() + '\nverified: false\n' + closing;
      }
    );

    if (updatedContent !== content) {
      fs.writeFileSync(fullPath, updatedContent);
      updated++;
      console.log(`  Updated: ${path.relative(path.join(__dirname, '..'), fullPath)}`);
    }
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped (already has verified): ${skipped}`);
