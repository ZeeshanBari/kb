---
title: "Graphify: evaluated for agent navigation — not now, one idea taken"
status: current
updated: 2026-08-02
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Graphify — evaluated 2026-08-02

**What it is:** an open-source (Apache-2.0), fully local tool that parses a codebase with 36 tree-sitter grammars and builds a queryable knowledge graph (`graph.json` + interactive HTML + report) *of the code itself* — so AI coding assistants traverse structure instead of grepping. Installs as a skill/MCP server into Claude Code, Cursor, Copilot, etc. (`uv tool install graphifyy` — a Python toolchain). ~60K GitHub stars, 4M+ PyPI downloads. First-party benchmarks are modest: ~49.7% recall@10, ~45.3% QA accuracy.

**Important distinction:** Graphify graphs **codebases for coding agents**. It is *not* a business-knowledge graph — it does not compete with our claim graph (ADR-0007), which graphs company communications and evidence. The only sensible use here would be helping agents navigate the `kb` repo itself.

## Verdict: not now

| Their sweet spot | Our reality |
|---|---|
| Large, unfamiliar monorepos where cross-file relationships are expensive to reconstruct | ~70 files, ~2k LOC of code, and a **designed** navigation layer (STATUS baton → AGENTS → RD → plan; enforced layer matrix) |
| Teams onboarding / due-diligence / takeover work | One operator + agents that boot from `CLAUDE.md` in seconds |
| Codebases where search fails | `check-docs` + `check-boundaries` + 47 docs keep the map truer than an extracted graph would be |

The reviews themselves say skip it for *"small, familiar services with strong documentation where search suffices"* — which is this repo, deliberately. Adoption would also add a Python toolchain to a TypeScript-only stack (ADR-0004) and a second map that can drift from the docs — the exact disease `check-docs` exists to prevent. Extracted edges "require source verification" per its own reviewers; our docs are already verified by CI.

**Revisit trigger (written down so it's honest):** when the codebase passes roughly **30–50k LOC** or agents demonstrably burn tokens re-discovering structure that the docs no longer capture — whichever comes first. At that point pilot it in code-only mode, local, as a dev-tool (never a runtime dependency).

## The one idea taken (the GraphRAG pattern again)

Graphify labels every edge's provenance — **extracted vs inferred vs ambiguous** — so agents know how much to trust a connection. Our claims already carry mandatory evidence and contradiction flags; adding an explicit `derivation` tag on claim edges (extracted-from-text vs inferred-across-claims) is a cheap, aligned enrichment. **Flagged as an idea for stage 5 (Relate)** — to be decided in RD-5, not here.

Sources: [graphify.com](https://graphify.com/) · [Wavect review](https://wavect.io/blog/graphify-review-codebase-knowledge-graph/) · [Augment Code writeup](https://www.augmentcode.com/learn/graphify-knowledge-graphs-ai-coding).
