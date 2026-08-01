---
title: "ADR-0001: Modular monolith — not lambdas, not microservices"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0001 — Modular monolith — not lambdas, not microservices

## Context
One small team, a steady-drip ingestion workload, an always-on API, and a history lesson: AOS v1's in-process boundaries drifted into fiction (symlinked import paths, two bus singletons, a phantom router) precisely because they cost nothing to cross.

## Decision
One **app** process (surfaces, answer, act) and one **worker** process (ingest, resolve, relate, measure), two systemd units on one box, meeting only in Postgres. Six feature modules that never import each other; one shared platform library.

## Rejected
- **Lambdas** — serverless prices spiky traffic; ingestion is a drip. Cold starts, the 15-minute cap kills extraction batches, and every function still needs Postgres for its cursor.
- **Microservices** — network boundaries between modules owned by one team: operational cost, zero isolation benefit.
- **Kubernetes** — the control plane would cost more than the system.

## Consequences
Easy: local dev, debugging, one deploy. Hard: nothing yet. **Exit:** the worker already runs as a separate process — moving it to another box is a `DATABASE_URL` change.
