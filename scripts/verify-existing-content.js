#!/usr/bin/env node

/**
 * One-time migration: marks all existing content as verified: true.
 *
 * These articles were already published on the live site before the
 * fact-checking pipeline was introduced. The new pipeline will handle
 * verification for all future articles.
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
let alreadyVerified = 0;

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Already verified
    if (/^verified: true$/m.test(content)) {
      alreadyVerified++;
      continue;
    }

    // Replace verified: false with verified: true
    let updatedContent = content.replace(/^verified: false$/m, 'verified: true');

    // If no verified field at all, add it
    if (!/^verified:/m.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        /^(---\n[\s\S]*?)(---)/m,
        (match, frontmatter, closing) => {
          return frontmatter.trimEnd() + '\nverified: true\n' + closing;
        }
      );
    }

    if (updatedContent !== content) {
      fs.writeFileSync(fullPath, updatedContent);
      updated++;
    }
  }
}

console.log(`Done. Set verified: true on ${updated} files. Already verified: ${alreadyVerified}.`);
