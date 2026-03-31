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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS risk_radar_cases (
      id SERIAL PRIMARY KEY,
      member_id INTEGER,
      state VARCHAR(50),
      company_size VARCHAR(50),
      issue_type VARCHAR(100),
      situation TEXT,
      facts TEXT,
      risk_analysis JSONB,
      is_demo BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS risk_radar_documents (
      id SERIAL PRIMARY KEY,
      case_id INTEGER,
      document_type VARCHAR(100),
      document_body TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// -- Form submissions --
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
    [data.formType, data.firstName || null, data.lastName || null, data.email || null,
     data.company || null, data.employees || null, data.interest || null, data.industry || null, data.message || null]
  );
  return result.rows[0];
}

// -- AI tool usage --
export async function saveAIUsage(data: {
  tool: string; input?: string; output?: string; state?: string; employeeCount?: string; industry?: string;
}) {
  await initDB();
  await pool.query(
    `INSERT INTO ai_tool_usage (tool, input, output, state, employee_count, industry) VALUES ($1, $2, $3, $4, $5, $6)`,
    [data.tool, data.input || null, data.output || null, data.state || null, data.employeeCount || null, data.industry || null]
  );
}

// -- Member codes --
export async function findMemberByCodeHash(hash: string) {
  await initDB();
  const result = await pool.query('SELECT * FROM member_codes WHERE code_hash = $1', [hash]);
  return result.rows[0] || null;
}

export async function findMemberById(id: number) {
  await initDB();
  const result = await pool.query('SELECT * FROM member_codes WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function updateMemberLastUsed(id: number) {
  await pool.query('UPDATE member_codes SET last_used_at = NOW(), updated_at = NOW() WHERE id = $1', [id]);
}

export async function createMemberCode(data: { codeHash: string; name: string; company?: string; email?: string; expiresAt?: string }) {
  await initDB();
  const result = await pool.query(
    `INSERT INTO member_codes (code_hash, name, company, email, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.codeHash, data.name, data.company || null, data.email || null, data.expiresAt || null]
  );
  return result.rows[0];
}

export async function updateMemberStatus(id: number, status: string) {
  await pool.query('UPDATE member_codes SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
}

export async function listMemberCodes() {
  await initDB();
  const result = await pool.query('SELECT * FROM member_codes ORDER BY created_at DESC');
  return result.rows;
}

// -- Risk Radar cases --
export async function saveRiskRadarCase(data: {
  memberId?: number; state: string; companySize: string; issueType: string;
  situation: string; facts?: string; riskAnalysis: unknown; isDemo: boolean;
}) {
  await initDB();
  const result = await pool.query(
    `INSERT INTO risk_radar_cases (member_id, state, company_size, issue_type, situation, facts, risk_analysis, is_demo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at`,
    [data.memberId || null, data.state, data.companySize, data.issueType,
     data.situation, data.facts || null, JSON.stringify(data.riskAnalysis), data.isDemo]
  );
  return result.rows[0];
}

export async function getRiskRadarCasesByMember(memberId: number) {
  const result = await pool.query(
    'SELECT * FROM risk_radar_cases WHERE member_id = $1 ORDER BY created_at DESC',
    [memberId]
  );
  return result.rows;
}

export async function getRiskRadarCase(id: number) {
  const result = await pool.query('SELECT * FROM risk_radar_cases WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// -- Risk Radar documents --
export async function saveRiskRadarDocument(data: { caseId: number; documentType: string; documentBody: string }) {
  await initDB();
  const result = await pool.query(
    `INSERT INTO risk_radar_documents (case_id, document_type, document_body) VALUES ($1, $2, $3) RETURNING id`,
    [data.caseId, data.documentType, data.documentBody]
  );
  return result.rows[0];
}

export async function getRiskRadarDocuments(caseId: number) {
  const result = await pool.query('SELECT * FROM risk_radar_documents WHERE case_id = $1 ORDER BY created_at DESC', [caseId]);
  return result.rows;
}

// -- Admin stats --
export async function getAdminStats() {
  await initDB();
  const total = await pool.query('SELECT COUNT(*) as count FROM risk_radar_cases');
  const member = await pool.query('SELECT COUNT(*) as count FROM risk_radar_cases WHERE member_id IS NOT NULL');
  const demo = await pool.query('SELECT COUNT(*) as count FROM risk_radar_cases WHERE is_demo = true');
  const issues = await pool.query(
    'SELECT issue_type, COUNT(*) as count FROM risk_radar_cases GROUP BY issue_type ORDER BY count DESC LIMIT 10'
  );
  return {
    totalCases: parseInt(total.rows[0].count),
    memberCases: parseInt(member.rows[0].count),
    demoCases: parseInt(demo.rows[0].count),
    issueTypes: issues.rows,
  };
}

// -- Email notifications --
export async function sendNotification(subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email notification');
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'AEA Notifications <notifications@site.kennion.com>',
        to: 'hunter@kennion.com',
        subject,
        html: body,
      }),
    });
    if (!res.ok) console.error('Email send failed:', await res.text());
  } catch (err) {
    console.error('Email send error:', err);
  }
}
