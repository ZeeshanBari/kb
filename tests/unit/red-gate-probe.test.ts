// بسم الله الرحمن الرحيم
// RED-GATE PROBE — this test fails ON PURPOSE (RD-0 exit test 2).
// The merge button on this PR must be BLOCKED while red. Never merge it;
// close the PR after confirming, and the branch gets deleted.
import { describe, it, expect } from 'vitest';

describe('RD-0 exit test 2 — the gate must hold', () => {
  it('fails on purpose so this PR shows red', () => {
    expect('the gate').toBe('holding');
  });
});
