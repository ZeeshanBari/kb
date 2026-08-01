// بسم الله الرحمن الرحيم
// The connector contract (ingestion-and-edge.md): cursor · deterministic ID ·
// ON CONFLICT DO NOTHING · cursor advances only in the SAME transaction as the
// writes. Backfill and live tail are the same code with a different cursor.
// Replay is safe by construction, not by discipline.

import type { Store } from '../../platform/src/store.ts';
import type { Label } from '../../platform/src/schema.ts';
import { publish } from '../../platform/src/events.ts';

export interface RawInput {
  extId: string;                // deterministic within the source
  label?: Label;
  payload: unknown;
}

export interface PullResult {
  items: RawInput[];
  nextCursor: string;           // opaque; stored only after commit
}

export interface Connector {
  source: string;               // 'slack', 'drive', 'filedrop', …
  pull(cursor: string | null): Promise<PullResult>;
}

export interface IngestStats {
  pulled: number;
  inserted: number;             // new rows (replays produce 0 here)
  cursor: string;
}

/**
 * One ingest cycle: pull → insert raw + event per NEW item → advance cursor,
 * all in one transaction. Kill the process anywhere and re-run: nothing is
 * lost and nothing duplicates.
 */
export async function ingestOnce(store: Store, connector: Connector): Promise<IngestStats> {
  const client = await store.pool.connect();
  try {
    const cur = await client.query(`SELECT position FROM ingest_cursor WHERE source = $1`, [connector.source]);
    const { items, nextCursor } = await connector.pull(cur.rows[0]?.position ?? null);

    await client.query('BEGIN');
    let inserted = 0;
    for (const item of items) {
      const id = `${connector.source}:${item.extId}`;
      const res = await client.query(
        `INSERT INTO raw_item (id, source, ext_id, label, payload)
         VALUES ($1, $2, $3, $4, $5::jsonb)
         ON CONFLICT (source, ext_id) DO NOTHING`,
        [id, connector.source, item.extId, item.label ?? 'private', JSON.stringify(item.payload)],
      );
      if (res.rowCount === 1) {
        inserted++;
        await publish(client, {
          kind: 'raw.ingested',
          actor: `connector:${connector.source}`,
          subjectType: 'raw_item',
          subjectId: id,
          label: item.label ?? 'private',
          idemKey: `raw.ingested:${id}`,
        });
      }
    }
    await client.query(
      `INSERT INTO ingest_cursor (source, position, advanced_at) VALUES ($1, $2, now())
       ON CONFLICT (source) DO UPDATE SET position = EXCLUDED.position, advanced_at = now()`,
      [connector.source, nextCursor],
    );
    await client.query('COMMIT');
    return { pulled: items.length, inserted, cursor: nextCursor };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
