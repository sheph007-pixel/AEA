import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id SERIAL PRIMARY KEY,
      form_type VARCHAR(50) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      email VARCHAR(255),
      company VARCHAR(255),
      employees VARCHAR(50),
      interest VARCHAR(255),
      industry VARCHAR(255),
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_tool_usage (
      id SERIAL PRIMARY KEY,
      tool VARCHAR(50) NOT NULL,
      input TEXT,
      output TEXT,
      state VARCHAR(50),
      employee_count VARCHAR(50),
      industry VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function saveSubmission(data: {
  formType: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  employees?: string;
  interest?: string;
  industry?: string;
  message?: string;
}) {
  await initDB();
  const result = await pool.query(
    `INSERT INTO form_submissions (form_type, first_name, last_name, email, company, employees, interest, industry, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, created_at`,
    [
      data.formType,
      data.firstName || null,
      data.lastName || null,
      data.email || null,
      data.company || null,
      data.employees || null,
      data.interest || null,
      data.industry || null,
      data.message || null,
    ]
  );
  return result.rows[0];
}

export async function saveAIUsage(data: {
  tool: string;
  input?: string;
  output?: string;
  state?: string;
  employeeCount?: string;
  industry?: string;
}) {
  await initDB();
  await pool.query(
    `INSERT INTO ai_tool_usage (tool, input, output, state, employee_count, industry) VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.tool, data.input || null, data.output || null, data.state || null, data.employeeCount || null, data.industry || null]
  );
}

export async function sendNotification(subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email notification');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'AEA Notifications <notifications@site.kennion.com>',
        to: 'hunter@kennion.com',
        subject,
        html: body,
      }),
    });
    if (!res.ok) {
      console.error('Email send failed:', await res.text());
    }
  } catch (err) {
    console.error('Email send error:', err);
  }
}
