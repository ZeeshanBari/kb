// بسم الله الرحمن الرحيم
// Schema as code (ADR-0004, ADR-0012): idempotent DDL applied at boot under an
// advisory lock. No migration framework, no version table. Every statement must
// be safe to run twice; assertOneStatement guards against smuggled multi-statements.

export const LABELS = ['open', 'private', 'secret'] as const;
export type Label = (typeof LABELS)[number];

/** The Phase-1 schema: raw items, the event log, cursors, consumer watermarks. */
export const DDL: string[] = [
  // ---- raw: layer 0 — append-only, exactly as ingested (data-layer.md) ----
  `CREATE TABLE IF NOT EXISTS raw_item (
     id          text PRIMARY KEY,            -- deterministic: "<source>:<ext_id>"
     source      text NOT NULL,
     ext_id      text NOT NULL,
     label       text NOT NULL DEFAULT 'private',
     payload     jsonb NOT NULL,
     ingested_at timestamptz NOT NULL DEFAULT now(),
     UNIQUE (source, ext_id)
   )`,
  `CREATE INDEX IF NOT EXISTS raw_item_source_idx ON raw_item (source, ingested_at DESC)`,

  // ---- the event log: the spine (data-layer.md invariants) ----
  `CREATE TABLE IF NOT EXISTS event (
     id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     ts           timestamptz NOT NULL DEFAULT now(),
     kind         text NOT NULL,
     actor        text NOT NULL,
     subject_type text,
     subject_id   text,
     label        text NOT NULL DEFAULT 'private',
     payload      jsonb NOT NULL DEFAULT '{}'::jsonb,
     caused_by    bigint REFERENCES event(id),   -- provenance chain
     idem_key     text UNIQUE,                   -- replay safety
     shadow       boolean NOT NULL DEFAULT false -- computed, not performed
   )`,
  `CREATE INDEX IF NOT EXISTS event_kind_idx ON event (kind, id)`,
  `CREATE INDEX IF NOT EXISTS event_subject_idx ON event (subject_type, subject_id, id)`,

  // ---- connector cursors: advanced only in the same txn as the writes ----
  `CREATE TABLE IF NOT EXISTS ingest_cursor (
     source      text PRIMARY KEY,
     position    text NOT NULL,
     advanced_at timestamptz NOT NULL DEFAULT now()
   )`,

  // ---- consumer watermarks: derived work reads the log incrementally ----
  `CREATE TABLE IF NOT EXISTS consumer_watermark (
     consumer      text PRIMARY KEY,
     last_event_id bigint NOT NULL DEFAULT 0,
     updated_at    timestamptz NOT NULL DEFAULT now()
   )`,
];

/** Reject any DDL element that smuggles a second statement (QM's guard). */
export function assertOneStatement(sql: string): void {
  const stripped = sql
    .replace(/'(?:[^']|'')*'/g, "''")        // string literals
    .replace(/\$\$[\s\S]*?\$\$/g, '$$$$')    // dollar-quoted bodies
    .replace(/--[^\n]*/g, '');               // line comments
  if (stripped.includes(';')) {
    throw new Error(`DDL element contains an embedded ';' — one statement per element:\n${sql.slice(0, 120)}`);
  }
}

for (const s of DDL) assertOneStatement(s);
