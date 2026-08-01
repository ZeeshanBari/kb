---
title: "ADR-0016: The execution plan — eleven stages, five gates, RDs first"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0016 — The execution plan: eleven stages, five gates, requirement docs first

## Context

All architecture decisions (ADR-0001…0015) and a proven Phase-1 scaffold (13/13 tests green against real Postgres) existed — but no agreed order of execution. The operator asked for a sequencing plan encompassing everything, with the testability and maintenance machinery built in, **before** any further building. It was proposed as `renders/kg-execution-plan.html`, reviewed together, and approved on 2026-08-01.

## Decision

Build in **eleven stages (0–10) plus a parallel mini track**, in the order recorded canonically in [`../03-reference/execution-plan.md`](../03-reference/execution-plan.md). Four sequencing principles govern the order: deploy the walking skeleton to the real box first; vertical slices, never horizontal layers; batch and front-load operator time (the 🔑 items); observability before the thing it observes.

Every stage passes the same **five gates** — RD agreed → built → exit test green in CI → check-docs green → deployed — followed by explicit operator sign-off. Requirement docs live in [`../06-requirements/`](../06-requirements/README.md), one page per stage, written and agreed **before** code: **no RD, no branch**. A stage is done when its exit test is green — never when a week ends.

## Rejected

- **Features first, deploy later** — the predecessor system met production for the first time at the end, with everything at stake; here the skeleton ships to the real box at stage 1 and every later stage deploys the day it's done.
- **Time-boxed sprints / dates** — a stage is done when its exit test is green; dates create pressure to skip gates.
- **Horizontal layers** (all ingest, then all resolve, then all answer) — pays off only at the very end; every stage here ends with something usable.

## Consequences

Easy: continuous deploys from stage 1; backups protect real data from the first week there is any; "done" is defined before work begins; the operator's four 🔑 items are visible far in advance. Hard: discipline — skipping a gate is never a shortcut, and mid-stage scope changes must amend the RD first, then the code. Exit path: supersede this ADR with a re-sequenced plan; the gates themselves would need their own ADR to change.
