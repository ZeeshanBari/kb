---
title: Ingestion & the edge
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Ingestion and the edge

## The funnel (cost control *and* RAM control)

| Stage | Coverage | Cost |
|---|---|---|
| Everything ingested raw | 100% | ≈ 0 |
| Deterministic pass — wink-nlp noun phrases · mentions · links · dates · numbers · thread structure | 100% | ≈ 0 |
| Triage — "worth reading?" (Haiku) | 100% in, ~5% out | cents |
| LLM extraction → claims (Sonnet) | ~5% | the only real spend |

*"ok thanks 👍" never reaches a model. Meeting minutes always do.* The same funnel keeps vectors selective (~200k chunks ≈ 0.6 GB halfvec) — which is what keeps the system on a CA$26 machine.

## The connector contract — every source, no exceptions

Cursor · deterministic external ID · `INSERT … ON CONFLICT DO NOTHING` · cursor advances **only after commit**. Backfill and live tail are the same code with a different cursor. Health = "has the cursor advanced within its SLA?" — absence of movement is the alarm.

| Source | Method | Cursor | Runs on |
|---|---|---|---|
| Slack | `conversations.history` + `users.list`; bot via socket mode | per-channel latest `ts` | VPS |
| Google Drive | `changes.list`; Docs→md, Sheets→CSV export | change page token | VPS |
| Gmail | `history.list` per account | `historyId` | VPS |
| Meeting audio | Drive folder → mini whisper → transcript returns as raw item | file id + checksum | VPS + mini |
| iMessage | `chat.db` WAL poll — **no API exists; this is why the mini exists** | rowid | mini |
| WhatsApp | desktop store / whatsmeow bridge | message id | mini |
| Spreadsheet numbers | registered sheets → `metric_fact`, deterministic | revision id | VPS |

## The mini is transport, not a second pipeline (ADR-0009)

The edge agent **pushes** its SQLite outbox over Tailscale to `POST /ingest` on the app. That endpoint does transport only — authenticate, validate, enqueue. The **same ingest pipeline** in the worker then applies the same dedup, deterministic pass, and event emission as every pulled source. From the raw table onward, nothing knows or cares where a message came from.

Push instead of pull, only because the mini sits behind NAT with no public ingress and the worker exposes no HTTP. One pipeline to test; the mini stays replaceable in a day.
