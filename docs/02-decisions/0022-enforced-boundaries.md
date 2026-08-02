---
title: "ADR-0022: Layer boundaries enforced in CI; the test pyramid declared per stage"
status: accepted
date: 2026-08-02
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0022 — Layer boundaries enforced in CI; the test pyramid declared per stage

## Context

The operator's requirement (2026-08-02): every stage must be testable, maintainable, and hardened, with **strict boundaries between layers** so unit, integration, contract, and E2E tests each have a real seam to grip. The predecessor system had boundaries in intention only — modules reached into each other, nothing was testable alone, and monitors read green over broken wiring. Intention is not enforcement.

## Decision

1. **The layer matrix** ([`../01-architecture/boundaries-and-testing.md`](../01-architecture/boundaries-and-testing.md)): `platform` imports nothing internal; `worker` and `app` import `platform` only and **never each other** — their shared language is the Postgres schema and event log; `edge` shares no code at all — its contract is one HTTP endpoint.
2. **Mechanical enforcement:** `tools/check-boundaries.mjs` — zero-dependency, ~80 lines, same philosophy as `check-docs` — parses every internal import and **fails the CI `test` job on a forbidden edge**. A boundary violation is a red PR, identical in consequence to a failing test. Changing the matrix means changing that file in a reviewed PR.
3. **The pyramid is declared per stage:** the RD template gains **Boundaries & test pyramid** and **Hardening** sections — every stage names what it adds at each tier (unit · integration · contract · E2E) and *"none" must be argued, not assumed*; hardening means enumerated failure modes, a tri-state check watching each, and caps wherever money or data flows.
4. RD-1 is amended to carry its concrete table before agreement — the requirement applies starting now, not starting later.

## Rejected

- **dependency-cruiser / eslint-plugin-boundaries** — real tools, but a dependency tree and config DSL for what ~80 owned lines do; revisit if the matrix outgrows the checker (the matrix survives a swap unchanged).
- **Enforcement by code review alone** — that is exactly the fictional-boundary failure being designed against.
- **Microservices to make boundaries physical** — ADR-0001 stands; import edges + schema contracts are checkable without paying network-hop complexity.

## Consequences

Easy: every layer is testable alone; a new agent learns the system's shape from one table; boundary erosion becomes impossible to do silently. Hard: the matrix must evolve deliberately — adding an edge is a reviewed decision, not a convenience. Exit path: swap the checker for a library; the matrix and the RD sections survive unchanged.
