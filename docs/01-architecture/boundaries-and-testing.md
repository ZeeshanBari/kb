---
title: Boundaries and the test pyramid
status: current
updated: 2026-08-02
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Boundaries and the test pyramid — enforced, not intended

The predecessor system's root failure was **fictional boundaries**: modules that looked separate but reached into each other freely, so nothing could be tested alone and monitors read green over broken wiring. Here, boundaries are **mechanically enforced** (ADR-0022): an import that crosses a forbidden edge is a red PR, the same as a failing test.

## The layers and their one-way edges

| Layer | Owns | May import (internal) | Its boundary medium |
|---|---|---|---|
| `platform/` | store · schema-as-code · labels · event log · health · (vault, stage 1) | **nothing** | is imported by others |
| `worker/` | connectors · pipeline · extraction · jobs | `platform` only | writes Postgres rows/events |
| `app/` *(stage 1+)* | HTTP · status page · wizard · answering · Slack | `platform` only | reads Postgres; serves HTTP |
| `edge/` *(track P)* | the mini agent: outbox · whisper · docling | **nothing** — HTTP only | POSTs to `app`'s `/ingest` |
| `tools/`, `deploy/` | checkers · converge CLI · compose | `platform` only (CLI) | operates from outside |

Two consequences that make the tiers possible:

- **`worker` and `app` never import each other.** Their only shared language is the Postgres schema (owned by `platform`'s schema-as-code) and the event log. Either side can be tested — or replaced — alone.
- **`edge` shares no code with the system.** Its contract is one HTTP endpoint. A mini can be enrolled, broken, or absent without touching a single import.

Enforcement: `tools/check-boundaries.mjs` (zero-dependency, same philosophy as `check-docs`) parses every import in every layer and fails CI on a forbidden edge. Changing the matrix = changing that file = a PR the operator reviews, with an ADR if structural.

## The four tiers, and what each is allowed to touch

| Tier | Touches | Speed | Exists today | Grows in |
|---|---|---|---|---|
| **Unit** | one module, pure logic — no I/O, no network, no DB | ms | 8 tests (labels, DDL guard, health verdicts) | every stage |
| **Integration** | one layer + **real Postgres** — zero DB mocks | seconds | 5 tests (idempotency, watermarks, replay, cursor health) | every stage |
| **Contract** | exactly one boundary: the connector suite (every connector must pass the same replay-safety assertions) · `/ingest` HTTP · the model gateway (cassettes) | seconds | connector contract implicit in Phase-1; named suites from stage 2 | stages 2, 5, P |
| **E2E** | the whole system through its front doors: install lane A/B (ADR-0017) · golden-50 via Slack · destroy→restore drill | minutes | drill arrives stage 1; lanes at first release | stages 1, 6, 9 |

Above the pyramid sit the **standing harnesses** (execution plan §harnesses): the eval gate, golden-50, restore drill, nightly install CI — hardening that never stops running.

## What "hardened" means per stage — concretely

Every RD must now declare (template §Boundaries & test pyramid, §Hardening):

1. **Failure modes enumerated** — what new ways this stage can break;
2. **a tri-state check watching each** — ok / fail / unverifiable, on the status page, forever;
3. **caps where money or data flows** — spend stops, size limits, rate limits — *stop first, alert second*;
4. **"none" at any tier must be argued, not assumed** — a stage with no contract tests says why.

The five gates (ADR-0016) already make a stage unfinishable without its exit tests; this page makes the *shape* of those tests non-negotiable.
