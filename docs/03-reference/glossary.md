---
title: Glossary
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Glossary

| Term | Meaning |
|---|---|
| **Claim** | One subject–predicate–object fact with confidence, validity window, and mandatory evidence. The graph is the set of claims |
| **Evidence span** | The exact source passage a claim cites. No span, no claim |
| **Label** | Per-row access level, enforced at read, failing closed. Derived rows inherit the most restrictive input |
| **Cursor / watermark** | Per-source resume position; advances only after commit. Stalls alarm |
| **The funnel** | 100% ingested → 100% deterministic pass → ~5% triaged → LLM extraction. Controls spend *and* RAM |
| **Shadow** | An action computed and recorded but not performed. Everything that acts ships shadow-first |
| **Golden-50** | Fifty real questions with known evidence sets and exact numbers, asserted in CI |
| **Extraction gate** | Precision ≥ .80 / recall ≥ .70 on 200 frozen labeled spans before an extractor version may run in production |
| **RRF** | Reciprocal Rank Fusion — deterministic merging of FTS and vector rankings in SQL |
| **Community summary** | Nightly Louvain clustering of the claim graph + one model-written summary per cluster; answers global questions |
| **Event log** | The append-only table every mutation flows through; provenance, replay, and health all derive from it |
| **Dead-man** | External heartbeat (healthchecks.io) that alarms when the box itself dies — the one failure SQL can't see |
| **Idempotency key** | Unique constraint making any replay a no-op — `ON CONFLICT DO NOTHING` |
| **Restore drill** | Monthly scripted proof that backups restore. A backup never restored does not exist |
| **Metric definition** | Human-written, versioned SQL defining a number. Models choose *which* metric, never *what it equals* |
