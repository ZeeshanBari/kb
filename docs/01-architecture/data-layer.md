---
title: Data layer
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# The data layer

Four layers. One rule: **everything above raw is rebuildable.**

| Layer | Contents | Policy |
|---|---|---|
| **0 · Raw** | message · document · blob · transcript, exactly as ingested | Append-only, immutable, the only thing that *must* be backed up |
| **1 · Resolved** | person · org · team · product · project — one canonical record each | Rebuildable; human-correctable |
| **2 · Related** | claims (the graph) · chunks + embeddings · metric facts · community summaries | Versioned by extractor; delete-and-rebuild at will; never backed up |
| **3 · Semantic** | metric definitions · ontology (closed predicate list) · access labels | Written by humans, versioned in git, reviewed |

## The claim table (the entire knowledge graph)

```sql
CREATE TABLE claim (
  id            bigserial PRIMARY KEY,      -- content hash → idempotent re-extraction
  subject_type  text, subject_id text,
  predicate     text,                        -- from the CLOSED, human-approved list
  object_type   text, object_id text, object_value text,
  valid_from    date, valid_to date,         -- when was this true
  confidence    real,
  extractor     text,                        -- version → rebuild & diff
  evidence_id   bigint NOT NULL,             -- exact source span. no evidence, no claim
  status        text                         -- proposed|accepted|contradicted|superseded|retracted
);
```

Four properties that do the work: **evidence is mandatory** · **time-bounded** (a graph without validity windows goes stale and confidently lies) · **contradictions flag, never overwrite** · **closed predicate list** (the difference between a graph and noise).

## Numbers

```sql
CREATE TABLE metric_definition (name, sql, grain, unit, owner, version, valid_from);
CREATE TABLE metric_fact (metric, dims jsonb, period, value, source_id, computed_at);
```

Definitions live in git, are PR-reviewed, and are versioned. Registered spreadsheets parse **deterministically** into `metric_fact` — no LLM ever touches a number.

## Platform invariants — on every row, from day one

- **Label** — reads fail closed; a derived row inherits its most restrictive input.
- **Provenance** — `caused_by` names the event behind every mutation.
- **Idempotency** — `ON CONFLICT DO NOTHING` is the whole retry story.
- **Shadow** — computed and recorded ≠ performed.
- **Derived is disposable** — versioned builders + event watermarks.

## Schema is code

Idempotent DDL applied at boot under an advisory lock. No migration framework, no version table. Raw layer is append-only so schema changes are additive; derived drops and rebuilds; the small resolved layer affords dump → recreate → reload → verify.
