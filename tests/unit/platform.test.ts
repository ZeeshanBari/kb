// بسم الله الرحمن الرحيم
import { describe, it, expect } from 'vitest';
import { DDL, assertOneStatement } from '../../platform/src/schema.ts';
import { labelAllows, labelWhere, labelRank } from '../../platform/src/store.ts';
import { runChecks } from '../../platform/src/health.ts';

describe('schema as code', () => {
  it('every DDL element is a single statement', () => {
    for (const s of DDL) expect(() => assertOneStatement(s)).not.toThrow();
  });
  it('rejects smuggled multi-statements', () => {
    expect(() => assertOneStatement('CREATE TABLE a (x int); DROP TABLE b')).toThrow(/one statement/);
  });
  it("ignores ';' inside string literals and comments", () => {
    expect(() => assertOneStatement("INSERT INTO t VALUES ('a;b') -- trailing; comment")).not.toThrow();
  });
  it('every statement is idempotent by construction', () => {
    for (const s of DDL) expect(s).toMatch(/IF NOT EXISTS/);
  });
});

describe('labels fail closed', () => {
  it('unknown label reads as secret', () => {
    expect(labelRank('banana')).toBe(labelRank('secret'));
    expect(labelAllows('private', 'banana')).toBe(false);
  });
  it('clearance is a ceiling', () => {
    expect(labelAllows('open', 'private')).toBe(false);
    expect(labelAllows('secret', 'open')).toBe(true);
  });
  it('labelWhere only ever widens with clearance', () => {
    expect(labelWhere('open')).toBe(`label IN ('open')`);
    expect(labelWhere('secret')).toContain(`'private'`);
  });
});

describe('tri-state health', () => {
  it('a throwing check is unverifiable, never a silent pass', async () => {
    const boom = async () => { throw new Error('db gone'); };
    Object.defineProperty(boom, 'name', { value: 'boom' });
    const [r] = await runChecks([boom as never]);
    expect(r!.verdict).toBe('unverifiable');
    expect(r!.detail).toContain('db gone');
  });
});
