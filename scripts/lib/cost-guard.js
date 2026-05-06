/**
 * Daily API token spending cap.
 *
 * Why this exists: a buggy generator or an infinite-loop fact-check pass could
 * silently rack up a large OpenAI bill. This guard tracks cumulative token
 * usage across all scripts in a per-day ledger and refuses further calls once
 * the cap is reached.
 *
 * Usage:
 *   const guard = require('./lib/cost-guard');
 *   guard.assertCanCall('fact-check');               // throws if over cap
 *   guard.recordUsage('fact-check', usageObject);    // call after each API response
 *
 * Env vars:
 *   OPENAI_DAILY_TOKEN_CAP   default 5_000_000 (~$2.50/day at gpt-4o-mini pricing)
 *   OPENAI_DAILY_USD_CAP     default $5  (computed from token usage; uses
 *                              gpt-4o-mini pricing of $0.15/M input + $0.60/M
 *                              output - override only if a different model is in use)
 *   COST_GUARD_LEDGER        default scripts/.api-usage.json
 *
 * Override either cap by setting the env var. Set to 0 to disable.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_TOKEN_CAP = Number(process.env.OPENAI_DAILY_TOKEN_CAP ?? 5_000_000);
const DEFAULT_USD_CAP = Number(process.env.OPENAI_DAILY_USD_CAP ?? 5);
const LEDGER_PATH =
  process.env.COST_GUARD_LEDGER || path.join(__dirname, '..', '.api-usage.json');

// gpt-4o-mini pricing as of writing. Override with env vars if model changes.
const PRICE_PER_M_INPUT = Number(process.env.OPENAI_PRICE_PER_M_INPUT ?? 0.15);
const PRICE_PER_M_OUTPUT = Number(process.env.OPENAI_PRICE_PER_M_OUTPUT ?? 0.60);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadLedger() {
  try {
    const raw = fs.readFileSync(LEDGER_PATH, 'utf8');
    const ledger = JSON.parse(raw);
    if (typeof ledger === 'object' && ledger !== null) return ledger;
  } catch {}
  return {};
}

function saveLedger(ledger) {
  try {
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
  } catch (err) {
    console.warn(`cost-guard: failed to write ledger: ${err.message}`);
  }
}

function getTodayEntry() {
  const ledger = loadLedger();
  if (!ledger[today()]) {
    ledger[today()] = {
      tokens: { prompt: 0, completion: 0, total: 0 },
      usd: 0,
      callsByScript: {},
    };
    saveLedger(ledger);
  }
  return { ledger, entry: ledger[today()] };
}

function tokenCap() {
  return DEFAULT_TOKEN_CAP > 0 ? DEFAULT_TOKEN_CAP : Infinity;
}
function usdCap() {
  return DEFAULT_USD_CAP > 0 ? DEFAULT_USD_CAP : Infinity;
}

function currentSpend() {
  const { entry } = getTodayEntry();
  return {
    tokens: entry.tokens.total,
    usd: entry.usd,
    tokenCap: tokenCap(),
    usdCap: usdCap(),
  };
}

class CostGuardError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CostGuardError';
    this.code = 'COST_GUARD_TRIPPED';
  }
}

/**
 * Throws if continuing would exceed the daily cap. Call before each API call.
 * The check is conservative: we use the current usage, not a projection,
 * because we don't know how many tokens the next call will consume.
 */
function assertCanCall(scriptName) {
  const { entry } = getTodayEntry();
  if (entry.tokens.total >= tokenCap()) {
    throw new CostGuardError(
      `Daily token cap reached: ${entry.tokens.total.toLocaleString()} >= ${tokenCap().toLocaleString()} ` +
        `(script: ${scriptName}). Raise OPENAI_DAILY_TOKEN_CAP to override.`
    );
  }
  if (entry.usd >= usdCap()) {
    throw new CostGuardError(
      `Daily USD cap reached: $${entry.usd.toFixed(2)} >= $${usdCap().toFixed(2)} ` +
        `(script: ${scriptName}). Raise OPENAI_DAILY_USD_CAP to override.`
    );
  }
}

/**
 * Record token usage from an OpenAI API response. Pass the `usage` object from
 * the response (`{ prompt_tokens, completion_tokens, total_tokens }`).
 * Safe to call with a missing/partial usage object.
 */
function recordUsage(scriptName, usage) {
  if (!usage) return;
  const prompt = Number(usage.prompt_tokens ?? 0) || 0;
  const completion = Number(usage.completion_tokens ?? 0) || 0;
  const total = Number(usage.total_tokens ?? prompt + completion) || 0;
  if (total <= 0) return;

  const usd = (prompt / 1_000_000) * PRICE_PER_M_INPUT + (completion / 1_000_000) * PRICE_PER_M_OUTPUT;

  const { ledger, entry } = getTodayEntry();
  entry.tokens.prompt += prompt;
  entry.tokens.completion += completion;
  entry.tokens.total += total;
  entry.usd += usd;
  entry.callsByScript[scriptName] = (entry.callsByScript[scriptName] || 0) + 1;
  ledger[today()] = entry;

  // Keep ledger small: prune entries older than 30 days.
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  for (const day of Object.keys(ledger)) {
    if (day < cutoff) delete ledger[day];
  }

  saveLedger(ledger);
}

function logSummary(scriptName) {
  const { entry } = getTodayEntry();
  console.log(
    `[cost-guard] ${scriptName}: today ${entry.tokens.total.toLocaleString()} tokens / $${entry.usd.toFixed(3)} ` +
      `(cap ${tokenCap().toLocaleString()} tokens / $${usdCap().toFixed(2)})`
  );
}

module.exports = {
  assertCanCall,
  recordUsage,
  currentSpend,
  logSummary,
  CostGuardError,
};
