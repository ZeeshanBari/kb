---
title: "RD-<stage>: <name>"
status: template
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# RD-\<stage\> — \<name\>

## Goal

Two sentences. What exists after this stage that didn't before — and for whom.

## Scope

- **In:** …
- **Out (deliberately):** … — and where it will happen instead.

## Exit tests — written first, as the CI assertions they become

| # | Assertion (runnable, binary) | Where it runs |
|---|---|---|
| 1 | e.g. replaying the connector inserts 0 rows and the cursor still advances | `tests/integration/…` |
| 2 | … | … |

## Delivers

- …

## Depends on

Stages/RDs that must be green first · credentials needed (see [`../03-reference/credentials-manifest.md`](../03-reference/credentials-manifest.md)).

## Risks & rollback

Biggest risk, one line. Rollback, one line: what `kb deploy` rolls back to; what data survives and how.

## Sign-offs

- RD agreed (gate 1): _date_ — operator
- Stage signed off (after gate 5): _date_ — operator
