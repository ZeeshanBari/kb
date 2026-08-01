---
title: External systems studied
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# External systems studied — QM and the Graph-RAG landscape

## QM (Y Combinator's multiplayer agent harness)

~1,030 TS files, Postgres, Slack + web, MIT. A *company* harness — opposite product to ours, but the best data discipline we found. **Taken:** per-row scope/audience labels enforced at read · `shadow BOOLEAN` on deliveries (dark-launch anything that acts) · schema-as-code idempotent DDL under an advisory lock · idempotency keys as unique columns · provenance as first-class indexed columns · consent-as-data (ask → grant, once|standing, expiry, used-at) · two attempt counters (failures vs crash-loops) · "durable by default — anything read back later never lives in RAM alone" · the AGENTS.md rules file itself. **Left:** ~50 opaque `(id, json)` JSONB tables (unqueryable at scale) · multi-instance/blue-green complexity · memory-as-one-notebook-with-substring-search (we keep real retrieval).

## Graph-RAG landscape

- **Microsoft GraphRAG** — proved local-vs-global search and community reports; its LLM-index-everything cost is prohibitive. **LazyGraphRAG** (same team) indexes at ~0.1% of the cost by deferring LLM work to query time — the strongest argument for our deterministic-first funnel.
- **Graphiti (Zep)** — bi-temporal, incremental knowledge graph; we borrow its validity-window model; rejected for Neo4j + Python footprint.
- **The Sprytix thread** (the original motivation doc) — directionally right about relationships beating chunk search for causal questions; overstated numbers; conflated text-graph traversal with quantitative analysis — which is precisely why our design separates the exact leg (SQL metrics) from the relational leg (claims). See ADR-0007.

## Primary links

microsoft/graphrag · LazyGraphRAG (MS Research blog) · getzep/graphiti · graphology.github.io · yc-software/qm · stanfordnlp/dspy · stanford-oval/storm
