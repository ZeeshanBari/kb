---
title: Start here
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# The Knowledge Graph — Documentation

**What this system is:** a company-wide knowledge base built from channel messages (Slack, WhatsApp, iMessage) and a shared drive, that answers multi-hop questions like *"why did sales drop in March?"* — and can prove its answers.

## How to read this

| Order | Folder | What it answers | Read when |
|---|---|---|---|
| 1 | `00-vision/` | Why this exists; the rules that never bend | First, always |
| 2 | `01-architecture/` | What the system is and how data flows — including how it installs | Before designing anything |
| 3 | `02-decisions/` | Why it's built *this* way — every choice, with rejected alternatives | Before proposing a change |
| 4 | `03-reference/` | Exact contracts — tools, SLAs, tests, phases, credentials, terms | While building |
| 5 | `04-practices/` | How we write docs and code here | Before contributing |
| 6 | `05-research/` | What we studied and what we learned from it | For deep context |
| 7 | `06-requirements/` | What each stage must deliver — agreed before code starts | Before starting any stage |

**Agents:** boot order is [`STATUS.md`](STATUS.md) → [`AGENTS.md`](AGENTS.md) → the active RD. Never touch anything before those three.

## The system in three sentences

Every message and document lands **raw and immutable** in one Postgres database, through one ingest pipeline. Deterministic passes run on 100% of it; an LLM extracts evidence-backed **claims** from only the ~5% worth reading; humans define every **metric** in versioned SQL. Answers come from three deterministic retrieval legs — exact numbers, semantic search, graph traversal — composed with a citation validator that drops any uncited sentence.

## Contents map

- `STATUS.md` — **the baton**: one-line status, remaining-in-stage, shipped features, agent boot order
- `00-vision/mission-and-principles.md` — the six features, the 13 principles
- `01-architecture/` — `system-overview` · `data-layer` · `ingestion-and-edge` · `answering` · `install-and-portability` · `setup-wizard`
- `02-decisions/` — ADR-0001…0019 (see its README for the index and template)
- `03-reference/` — `stack-and-tools` · `testing-and-observability` · `execution-plan` (ADR-0016) · `glossary` · `credentials-manifest` · `per-unit-checklist` (per company / per mini)
- `04-practices/` — `documentation-rules` · `conventions` (incl. the basmallah convention)
- `05-research/` — `lessons-from-aos-v1` · `external-systems-qm-graphrag` · `graphify-evaluation`
- `06-requirements/` — the RD process + `RD-template.md`; one page per stage, no RD no branch

## Folder layout (ADR-0014, ADR-0015)

```
(this folder — becomes kb/docs/ inside the monorepo when code exists)
├── 00-vision … 05-research      ← the docs: the ONLY source of truth
├── renders/                     ← generated HTML presentations + MANIFEST.json
│                                   never edit facts here — fix the doc, regenerate
└── tools/check-docs.mjs         ← drift · links · front-matter · ADR-index · freshness
```

Run the checker from this folder: `node tools/check-docs.mjs` — it fails on broken links, unmanifested or stale renders, and ADR-index drift.

## Renders (human-facing presentations)

| File | Renders |
|---|---|
| `renders/kg-architecture-spec.html` | The system: one map, decision cards A–H, all diagrams |
| `renders/kg-install-spec.html` | Install & portability: flow, credentials, install=upgrade=restore |
| `renders/kg-wizard-proposal.html` | The wizard: 16 screen mockups, every question (ADR-0013) |
| `renders/kg-execution-plan.html` | The agreed execution plan: 11 stages + mini track, five gates (ADR-0016) |
| `renders/kg-ship-and-onboard.html` | Production rungs, feature lifecycle, one onboarding flow, agentic PRs (ADR-0017/0018) |

The early AOS-v1 study files were retired; their distilled lessons live in `05-research/lessons-from-aos-v1.md`.
