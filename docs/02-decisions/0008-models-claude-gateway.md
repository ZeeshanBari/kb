---
title: "ADR-0008: Claude behind one gateway; local models rejected for extraction"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0008 — Claude behind one gateway; local models rejected for extraction

## Context
The graph is only as good as its extractor: a model missing the .80 precision gate poisons every downstream answer. Spend is controlled structurally (the ~5% funnel) rather than by degrading the model.

## Decision
**Haiku** for triage, **Sonnet** for extraction and answers; structured outputs via tool-use JSON schema validated by Zod; a **pinned embedding model** (text-embedding-3-small to start). Every call through **one gateway module** — retries, auth-failure detection, daily hard-cap (stop *then* alert, never the reverse), cost log, cache-stable prompts. Model names are config.

## Rejected
- **Local models on the mini** (Ollama/Qwen) — free tokens, but they miss the precision gate, and the mini becomes bottleneck + single point of failure. Revisit for *triage only*, where a wrong call costs one skipped message.
- **LangChain/LlamaIndex as the calling layer** — the gateway is ~300 lines we must fully control; frameworks abstract exactly those parts.
- **Multi-vendor from day one** — the gateway makes swapping a config change later; premature complexity now.

## Consequences
Easy: one choke point for budget, retry, and cost accounting. Hard: vendor concentration — mitigated by the gateway seam and by evals that make any swap measurable overnight.
