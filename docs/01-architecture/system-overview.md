---
title: System overview
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# System overview

One picture (rendered in `../../kg-architecture-spec.html`, section 0), in words:

## The machines

| Machine | Role | Never |
|---|---|---|
| **Hetzner CX42 VPS** (Falkenstein, 8 vCPU/16 GB, ≈CA$26/mo) | The core — system of record | — |
| **Mac mini** (owned, edge appliance) | Reads what only a Mac can read; transcribes; parses hard PDFs | Holds the only copy of anything |
| **Cloudflare R2** (≈CA$3/mo) | Blobs + backups, zero egress | — |

## The processes (both on the VPS, systemd)

| Process | Contains | Talks to |
|---|---|---|
| **app** | surfaces (web UI · Slack bot · HTTP API · `/ingest`) · ⑤ answer · ⑥ act | browsers, Slack (socket mode, outbound), the mini (Tailscale) |
| **worker** | ① ingest · ② resolve · ③ relate · ④ measure | cloud APIs (pull), Anthropic (via gateway) |
| **platform** | *not a process* — one shared library linked into both: store + labels · event log · model gateway · health | Postgres |

**The module rule:** the six feature modules never import each other. They meet only in the platform — the store and the event log. A sideways import is a build error (lint-enforced).

## The flows

1. **Pull:** worker polls Slack/Drive/Gmail with cursors → raw rows.
2. **Push:** the mini's edge agent POSTs its outbox over Tailscale to `/ingest` on the app → queued → **the same ingest pipeline** (ADR-0009).
3. **Derive:** deterministic pass on 100% → triage marks ~5% → extraction produces claims with evidence → communities summarize nightly.
4. **Answer:** three parallel legs (metric SQL · hybrid search · graph walk) → composed → citation-validated.
5. **Act:** typed adapters (kanban) — shadow rows first, live after a verified week.
6. **Protect:** pgBackRest streams to R2 nightly; a monthly restore drill proves it.

## Key facts

- **One public port:** 443. Slack is outbound; the mini is Tailscale; SSH is behind Tailscale.
- **One database:** Postgres 17 — rows, event log, queue (pg-boss), FTS, vectors (pgvector halfvec), graph (claim table + recursive CTE).
- **Money:** infra ≈ CA$31/mo · model usage ≈ CA$45–140/mo, hard-capped daily. Full table in the spec, section 2.
