// بسم الله الرحمن الرحيم
// Tri-state health (ADR-0006): every check answers ok, fail, or could-not-verify.
// A monitor that reports OK when it verified nothing hides every bug it exists to catch.

import type pg from 'pg';

export type Verdict = 'ok' | 'fail' | 'unverifiable';

export interface CheckResult {
  name: string;
  verdict: Verdict;
  detail: string;
}

export type Check = () => Promise<CheckResult>;

/** Run all checks; a throwing check is 'unverifiable', never a silent pass. */
export async function runChecks(checks: Check[]): Promise<CheckResult[]> {
  return Promise.all(
    checks.map(async (c) => {
      try {
        return await c();
      } catch (err) {
        return { name: c.name || 'anonymous', verdict: 'unverifiable' as const, detail: String(err) };
      }
    }),
  );
}

/**
 * The load-bearing Phase-1 check: has this source's cursor advanced within its SLA?
 * The ABSENCE of data is the failure mode (mission-and-principles.md #4).
 * No cursor row at all → 'unverifiable' — we cannot claim health we haven't seen.
 */
export function cursorAgeCheck(pool: pg.Pool, source: string, slaMs: number): Check {
  const check = async (): Promise<CheckResult> => {
    const res = await pool.query(
      `SELECT advanced_at, now() - advanced_at AS age FROM ingest_cursor WHERE source = $1`,
      [source],
    );
    if (res.rowCount === 0) {
      return { name: `cursor:${source}`, verdict: 'unverifiable', detail: 'no cursor yet — source never ingested' };
    }
    const ageMs = Date.now() - new Date(res.rows[0].advanced_at).getTime();
    return ageMs <= slaMs
      ? { name: `cursor:${source}`, verdict: 'ok', detail: `advanced ${Math.round(ageMs / 1000)}s ago` }
      : { name: `cursor:${source}`, verdict: 'fail', detail: `stalled ${Math.round(ageMs / 1000)}s > SLA ${slaMs / 1000}s` };
  };
  Object.defineProperty(check, 'name', { value: `cursor:${source}` });
  return check;
}
