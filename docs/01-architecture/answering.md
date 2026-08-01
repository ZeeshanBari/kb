---
title: Answering
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Answering

## One question is three questions

*"Why did sales drop in March?"* decomposes into:

| Leg | Question | Engine | Nature |
|---|---|---|---|
| **Exact** | How much, which segment, vs what baseline? | SQL over metric definitions | A fact. 100% deterministic |
| **Semantic** | What was said and decided in that window? | FTS + pgvector, fused with RRF | Evidence. Reproducible |
| **Relational** | Which events plausibly connect? | Claim-graph walk, recursive CTE ≤ 4 hops | A hypothesis. Never a claim |

Global questions ("what are our recurring supplier risks?") use the nightly **community summaries** (graphology Louvain + one Sonnet summary per community) — GraphRAG's best idea, on our storage (ADR-0007).

## The engine

A small, budgeted agent loop (Anthropic SDK, hand-rolled ~200 lines) with **exactly three tools**: `metric.lookup`, `evidence.search`, `graph.walk`. After composition, the **citation validator**: any sentence that doesn't cite evidence returned *in this session* is regenerated once, then dropped. p95 target < 10 s. The whole exchange lands in the event log with provenance.

## Why this is as deterministic as an LLM system gets

The number is versioned SQL — exact forever. The evidence set is pinned, non-sampling retrieval — reproducible. The graph walk is a CTE — deterministic. Only the final prose varies, and every sentence of it is pinned to evidence IDs. **Test the inputs to the prose, and wording stops mattering** — which is exactly what the golden-50 does.

## The honest-answer contract

Facts and hypotheses are visually and structurally separated. The system states uncertainty plainly and never infers causation from correlation. A cited "I don't know" beats an eloquent guess.
