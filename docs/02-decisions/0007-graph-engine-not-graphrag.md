---
title: "ADR-0007: Steal GraphRAG's ideas, not its pipeline"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0007 — Steal GraphRAG's ideas, not its pipeline

## Context
The research thread that motivated this project pitched Microsoft GraphRAG. Study showed: full GraphRAG batch-indexes with LLM extraction over *everything* — the cost its own successor **LazyGraphRAG** exists to undo (indexing at 0.1% of GraphRAG's cost) — and it owns its storage artifacts (parquet/LanceDB), which cannot host our invariants.

## Decision
A thin layer on our own Postgres: the **claim table** (evidence-mandatory · time-bounded · contradiction-flagging · label-enforced) + **recursive-CTE traversal** for local questions + nightly **community detection** (graphology + Louvain, in-process TS) with one Sonnet summary per community for global questions. GraphRAG's two durable ideas — local vs global search, community reports — implemented over our schema, ~500 lines.

## Rejected
- **Microsoft GraphRAG (library)** — storage ownership, batch orientation, LLM-extracts-everything cost, Python pipeline in a TS system.
- **LightRAG / LlamaIndex property-graph** — same storage problem plus framework lock-in.
- **Neo4j GraphRAG** — second database (ADR-0003).
- **Graphiti (Zep)** — closest existing match (bi-temporal edges, incremental); we borrow its temporal model; rejected for Neo4j/FalkorDB + Python service footprint.

## Consequences
Easy: our guarantees (evidence, time, labels, contradictions) hold everywhere because we own the store. Hard: we maintain ~500 lines libraries would provide. The genuinely hard part — extraction *quality* — no graph library solves; the eval gate does.
