---
title: Status — the baton
status: current
updated: 2026-08-02
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Status — the baton

**The one-line status** *(mirror of the repo About — synced automatically):*

> Stage 0 — the repo gate · done ✓ 2026-08-02 · shipped: replay-safe ingest platform · self-checking docs · CI merge gate · auto-PR workshop · next: stage 1, walking skeleton (RD-1 proposed)

Every PR that changes what's true here updates this file — rule 5 applies to status too.

## Where we are

| | |
|---|---|
| **Active stage** | 0 **closed 2026-08-02** → 1 pending RD agreement |
| **Stage-0 record** | all exit tests demonstrated live: seed CI green · red PR #3 blocked and closed unmerged · docs gate in CI · fresh-clone suite 13/13 · About auto-sync proven on PR #2's merge |
| **Next stage** | 1 — walking skeleton on the real box · [RD-1](06-requirements/RD-1-walking-skeleton.md) **proposed — no agreement, no branch** |
| **Waiting on operator** | merge the stage-0 closeout PR · read RD-1 → agree or amend · then the stage-1 🔑 items: Hetzner API token + R2 keys into the hand-off `.env` · flip `kb-deploy` private (ADR-0020 pre-condition) |

## Shipped so far — one line per feature

- **Platform core** — raw store with labels failing closed · idempotent event log · tri-state health; 13/13 against real Postgres from a fresh `npm ci`
- **Connector contract + filedrop** — replay-safe by construction; the Phase-1 exit test (replay changes nothing) is a permanent CI assertion
- **Self-checking docs** — the full decision record (ADR-0001…0021), agreed execution plan, RD process; `check-docs` fails CI on drift, broken links, stale renders
- **The agentic workshop** — CI merge gate (test · docs · gitleaks), proven to block a red PR · push-a-branch-opens-a-PR (`auto-pr`), proven twice · worktree per PR · About auto-synced from this file (`about-sync`)

## How a new agent picks up the baton

1. **Read this file** — you now know where work stands and what's blocked on whom.
2. **Read [AGENTS.md](AGENTS.md)** — 15 load-bearing rules; agree-first (12) and no-RD-no-branch (15) bite hardest.
3. **Read the active stage's RD** in [06-requirements/](06-requirements/README.md) — "done" is defined there, as CI assertions.
4. **Skim the [execution plan](03-reference/execution-plan.md)** — the agreed order; never re-sequence it silently.
5. **Check open PRs before starting:** `git ls-remote origin 'refs/pull/*/head'` — a previous agent's branch may hold the file you're about to touch.
6. **Work per ADR-0018/0019/0020:** one worktree per branch (`s<stage>/…`, `docs/…`, `fix/…`) · push and the PR opens itself · the operator merges, never you · credentials come from the operator's hand-off file, never chat, never committed.
