---
title: "ADR-0009: The Mac mini is transport, not a second pipeline"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0009 — The Mac mini is transport, not a second pipeline

## Context
A review of the system map raised the right question: mini data entered through the app while cloud data entered through the worker — implying two ingestion paths. Two pipelines would mean two dedup implementations, two test surfaces, and divergence.

## Decision
There is **one ingest pipeline**. The mini's edge agent pushes its durable SQLite outbox over Tailscale to `POST /ingest` on the app. That endpoint does **transport only** — authenticate, validate shape, enqueue. The worker's ingest module then applies the identical contract every pulled source gets: deterministic external ID, `ON CONFLICT DO NOTHING`, deterministic pass, event emission, cursor/watermark semantics. From the raw table onward, no code knows where a message came from.

## Rejected
- **Mini writes straight to Postgres** — would bypass the pipeline's dedup/label/event guarantees and require exposing the database to the edge.
- **Worker polls the mini** — the mini sits behind NAT with no public ingress and sleeps; push-with-outbox survives disconnection and gives at-least-once delivery with idempotent dedupe.
- **A second normalization path on the mini** — the edge stays dumb on purpose; a dumb edge is replaceable in a day.

## Consequences
Easy: one pipeline to test; connector cassettes cover push and pull identically. Hard: nothing. The system map now draws both arrows converging on ① ingest.
