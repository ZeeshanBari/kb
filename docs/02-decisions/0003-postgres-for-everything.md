---
title: "ADR-0003: Postgres does everything"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0003 — Postgres does everything

## Context
Every extra infrastructure component is another thing that can fail silently while its monitor reads green (the defining AOS v1 failure). The corpus is a few million messages — small by database standards.

## Decision
**Postgres 17** is the store, the event log, the job queue (**pg-boss**), the keyword search (**tsvector**), the vector index (**pgvector** `halfvec`), and the graph (claim table + recursive CTE ≤ 4 hops).

## Rejected
- **Redis** — a second thing to secure and back up, for <100 jobs/min.
- **Elasticsearch** — a JVM and 1 GB heap for a corpus FTS handles.
- **Neo4j** — a second database with its own backup/migration/consistency story, for a one-table graph.
- **SQS/EventBridge** — the event log must be queryable *with* the data; joins are the point.

## Consequences
Easy: backup = one database + one bucket; the monthly restore drill covers the entire system. Hard: if vectors outgrow RAM, we shard embeddings or add a read replica — a known, deferred problem. **Exit:** each concern (queue, search, vectors) has a standard extraction path if scale demands it.
