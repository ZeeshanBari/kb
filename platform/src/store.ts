// بسم الله الرحمن الرحيم
// The store: one connection factory, one place that knows where data lives.
// Schema is applied at boot under an advisory lock so N processes can race safely.

import pg from 'pg';
import { DDL, assertOneStatement, type Label, LABELS } from './schema.ts';

// pg returns int8 (bigint) as strings; our ids are event counters that fit
// comfortably in a JS number (2^53 ≈ 9 quadrillion events). Parse once, globally.
pg.types.setTypeParser(20, (v) => Number(v));

const SCHEMA_LOCK_KEY = 'kb:schema-init';

export interface Store {
  pool: pg.Pool;
  applySchema(): Promise<void>;
  close(): Promise<void>;
}

export function createStore(connectionString: string): Store {
  const pool = new pg.Pool({ connectionString, max: 10 });

  async function applySchema(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('SELECT pg_advisory_lock(hashtext($1))', [SCHEMA_LOCK_KEY]);
      for (const stmt of DDL) {
        assertOneStatement(stmt);
        await client.query(stmt);
      }
    } finally {
      await client.query('SELECT pg_advisory_unlock(hashtext($1))', [SCHEMA_LOCK_KEY]).catch(() => {});
      client.release();
    }
  }

  return { pool, applySchema, close: () => pool.end() };
}

/** Labels fail closed: an unknown label is treated as 'secret' (data-layer.md). */
export function labelRank(label: string): number {
  const i = LABELS.indexOf(label as Label);
  return i === -1 ? LABELS.length - 1 : i;
}

/** May a reader cleared up to `clearance` see a row labeled `label`? */
export function labelAllows(clearance: Label, label: string): boolean {
  return labelRank(label) <= labelRank(clearance);
}

/** SQL fragment for read paths: rows at or below the reader's clearance. */
export function labelWhere(clearance: Label, column = 'label'): string {
  const allowed = LABELS.slice(0, labelRank(clearance) + 1);
  return `${column} IN (${allowed.map((l) => `'${l}'`).join(', ')})`;
}
