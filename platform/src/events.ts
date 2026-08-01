// بسم الله الرحمن الرحيم
// The event log: publishing is an INSERT; consuming is a watermark read.
// Idempotency keys make every replay a no-op; provenance chains via caused_by.

import type pg from 'pg';
import type { Label } from './schema.ts';

export interface PublishInput {
  kind: string;                 // 'raw.ingested', 'cursor.advanced', …
  actor: string;                // 'connector:slack', 'operator', 'system:health'
  subjectType?: string;
  subjectId?: string;
  label?: Label;
  payload?: unknown;
  causedBy?: number;
  idemKey?: string;             // same key twice → second publish returns null
  shadow?: boolean;
}

export interface EventRow {
  id: number; ts: Date; kind: string; actor: string;
  subject_type: string | null; subject_id: string | null;
  label: string; payload: unknown; caused_by: number | null; shadow: boolean;
}

type Q = pg.Pool | pg.PoolClient;

/** Insert one event. Returns its id, or null when idemKey already exists. */
export async function publish(q: Q, e: PublishInput): Promise<number | null> {
  const res = await q.query(
    `INSERT INTO event (kind, actor, subject_type, subject_id, label, payload, caused_by, idem_key, shadow)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9)
     ON CONFLICT (idem_key) DO NOTHING
     RETURNING id`,
    [e.kind, e.actor, e.subjectType ?? null, e.subjectId ?? null, e.label ?? 'private',
     JSON.stringify(e.payload ?? {}), e.causedBy ?? null, e.idemKey ?? null, e.shadow ?? false],
  );
  return res.rows[0]?.id ?? null;
}

/** Read events past this consumer's watermark, oldest first. */
export async function readSince(q: Q, consumer: string, limit = 100): Promise<EventRow[]> {
  const res = await q.query(
    `SELECT e.* FROM event e
     WHERE e.id > COALESCE((SELECT last_event_id FROM consumer_watermark WHERE consumer = $1), 0)
     ORDER BY e.id ASC LIMIT $2`,
    [consumer, limit],
  );
  return res.rows as EventRow[];
}

/** Advance the consumer's watermark after it has durably handled events ≤ lastId. */
export async function ack(q: Q, consumer: string, lastId: number): Promise<void> {
  await q.query(
    `INSERT INTO consumer_watermark (consumer, last_event_id, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (consumer) DO UPDATE
       SET last_event_id = GREATEST(consumer_watermark.last_event_id, EXCLUDED.last_event_id),
           updated_at = now()`,
    [consumer, lastId],
  );
}
