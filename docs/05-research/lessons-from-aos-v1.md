---
title: Lessons from AOS v1
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Lessons from AOS v1 (the 176k-line predecessor study)

We audited `AOS-Agent/aos` — an ambitious agentic-OS with genuinely excellent engineering culture — and distilled why it struggled. Each failure below maps to a countermeasure that is now a rule in this system.

## The failure patterns → our countermeasures

| v1 failure (verified in code) | Countermeasure here |
|---|---|
| "Structurally complete but functionally unwired, monitors green" — its own CHANGELOG's words | Shadow mode + health checks that assert *effects*, not imports |
| 8 event mechanisms, ~166 publish sites, **zero replayable**; a bus publishing to zero subscribers undetected | **One** append-only event log; absence of expected events is queryable |
| A shared LLM router imported by 3 subsystems that **did not exist on disk**; features dark for months | One model gateway that exists before anything calls models; effect-asserting checks |
| 70 forward-only migrations; 7 wrapped schema writes in `except: pass` and reported success | Schema-as-code; raw layer append-only; derived rebuildable; small core affords dump-and-rebuild |
| 461 swallowed exceptions; 85 sitting on DB/network/process operations | Errors are events; swallowing is lint-banned |
| Only 1 of 4 databases backed up; **no restore path at all** | One database + one bucket; monthly restore drill as a first-class test |
| 244 raw DB connections, 109 hardcoded paths, ontology at 15% adoption | One store module; one connection factory; no generic entity tables |
| Privacy solved 4 different ways in 4 places | One label column, enforced at read, failing closed |
| Hardcoded operator paths silently disabling safety hooks on other machines | No absolute paths in code; config with validation |
| Retired-but-present code (a whole desktop app, 2 dead services) still confusing every reader | Delete first; `status: superseded`, never zombie |

## What v1 got *right* (adopted wholesale)

- **Tri-state checks** — "a check must be able to say *I could not verify this*."
- **Manifests over hardcoded lists** — things declare themselves; registries are derived.
- **Attribution rigor** — never invent an actor; derive history from an audit trail.
- **Privacy at build time** — restricted entities get no cache entry at all, so no read path can leak them.
- **The eval gate** — a frozen, hash-verified dataset gating any LLM component's deployment.
- **An honest changelog** — naming your own failure modes is what made this study possible.
