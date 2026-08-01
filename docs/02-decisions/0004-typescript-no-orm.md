---
title: "ADR-0004: TypeScript end-to-end, no ORM, schema as code"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0004 — TypeScript end-to-end, no ORM, schema as code

## Context
One team, many connectors (Slack Bolt and googleapis are first-party TypeScript), extraction done via LLM APIs rather than local NLP.

## Decision
**Node 22 + TypeScript everywhere** — Fastify, raw `pg`, **Zod** at every boundary, React + Vite, Vitest. Schema is idempotent DDL applied at boot under an advisory lock — no migration framework. Python exists only on the mini (mlx-whisper, Docling).

## Rejected
- **Python core** — its NLP-library edge doesn't apply to LLM-API extraction; two toolchains is pure tax.
- **ORMs** (Prisma/Drizzle) — a codegen layer that owns your migrations; ~15 tables of SQL *is* the clearer contract.
- **Go edge agent** — a second language to save 30 MB on a 16 GB machine.

## Consequences
Easy: one test runner, one lint stack, one mental model. Hard: heavy local NLP would need a sidecar (that's what the mini's Python is for). **Exit:** the schema-as-code pattern is framework-free — nothing locks us in.
