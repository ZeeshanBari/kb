---
title: Testing & observability
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Testing & observability

## Test lanes

| Lane | Runs | Contains |
|---|---|---|
| **Every PR** (< 5 min, no network) | unit (Vitest) → store (real Postgres service container, zero DB mocks) → connector cassettes (recorded real payloads, replayed) → golden-50 |
| **Nightly** (live, $-capped) | extraction eval (200 frozen labeled spans; gate: precision ≥ .80, recall ≥ .70) → live smokes vs real APIs → answer-quality eval |
| **Monthly** | restore drill — pull R2 backup → restore to scratch → verify counts + checksums |

Named mechanisms: **cassettes** (record once, replay in CI) · **the extraction gate** (an extractor version cannot run in production without clearing the gate) · **golden-50** (real questions with known evidence sets and exact numbers — CI asserts retrieval sets and numbers, never prose) · **determinism check** (same fixture + version twice → byte-identical claims) · **shadow week** (act adapters write dark rows for a verified week before going live).

## Observability (ADR-0006)

Health = SQL views over the event log → in-app status page. Every check answers **ok / fail / could-not-verify**. External dead-man: healthchecks.io. Exceptions: Sentry. Alerts land in Slack `#kb-health`.

| Signal | Green | On breach |
|---|---|---|
| Slack cursor age | ≤ 10 min | alarm — absence of data is the failure mode |
| Drive / Gmail cursor age | ≤ 30 min | alarm |
| Mini sources cursor age | ≤ 26 h | alarm |
| Extraction backlog | < 2 days | page |
| Model spend today | under cap | **hard stop at gateway, then alert** |
| Backup age / drill age | ≤ 26 h / ≤ 35 d | page |
| Review queues | < 50 · weekly review | digest |
