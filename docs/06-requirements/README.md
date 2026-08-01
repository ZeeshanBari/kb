---
title: Requirement docs (RDs)
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Requirement docs — one page before any code

Gate 1 of the five ([ADR-0016](../02-decisions/0016-execution-plan.md)). One RD per stage — or per stage-slice, when a stage splits into several PR-sized pieces. **No RD, no branch.**

| Rule | Why |
|---|---|
| Written before code, agreed by the operator, then frozen | "Done" is defined before work begins |
| Exit tests written as the CI assertions they will become | The test *is* the requirement — no prose-only promises |
| Scope change mid-stage → amend the RD first, then the code | The doc leads; the code follows. Never the reverse |
| Same front-matter, same checker, same repo as every other doc | RDs cannot drift silently |

**Naming:** `RD-<stage>-<name>.md` — e.g. `RD-0-repo-gate.md`, `RD-1-walking-skeleton.md`. Start by copying [`RD-template.md`](RD-template.md).

**Status flow:** `proposed → agreed → done → superseded`. The `done` stamp carries the operator's sign-off date (the step after gate 5).
