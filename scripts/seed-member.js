#!/usr/bin/env node

/**
 * Seed a sample member code for testing.
 * Usage: DATABASE_URL=postgres://... node scripts/seed-member.js
 *
 * Creates a member with code "TESTMEMBER01" (or custom code via argument).
 */

const { Pool } = require('pg');
const crypto = require('crypto');

async function main() {
  const code = process.argv[2] || 'TESTMEMBER01';
  const name = process.argv[3] || 'Test Member';
  const company = process.argv[4] || 'Test Company';

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
  });

  // Create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS member_codes (
      id SERIAL PRIMARY KEY,
      code_hash VARCHAR(128) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      email VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      last_used_at TIMESTAMP
    )
  `);

  const hash = crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');

  try {
    await pool.query(
      `INSERT INTO member_codes (code_hash, name, company, status) VALUES ($1, $2, $3, 'active')`,
      [hash, name, company]
    );
    console.log(`Member code created successfully.`);
    console.log(`Code: ${code.toUpperCase()}`);
    console.log(`Name: ${name}`);
    console.log(`Company: ${company}`);
    console.log(`Status: active`);
  } catch (err) {
    if (err.code === '23505') {
      console.log(`Code "${code}" already exists in the database.`);
    } else {
      throw err;
    }
  }

  await pool.end();
}

main().catch(console.error);
