---
title: Status — the baton
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Status — the baton

**The one-line status** *(mirror of the repo About):*

> Stage 0 — the repo gate · ~95% done · shipped: replay-safe ingest platform · self-checking docs · CI merge gate · auto-PR workshop

Every PR that changes what's true here updates this file — rule 5 applies to status too.

## Where we are

| | |
|---|---|
| **Active stage** | 0 — the repo gate · [RD-0](06-requirements/RD-0-repo-gate.md) (agreed) |
| **Remaining in stage** | operator merges PR #1 (ADR-0020) and PR #2 (this navigation layer) · required checks `test` · `docs` · `gitleaks` added to the main ruleset (~30 s in Settings → Rules) · operator done-stamp on RD-0 |
| **Next stage** | 1 — walking skeleton on the real box. **RD-1 not yet written — no RD, no branch** |
| **Waiting on operator** | the two merges · the ruleset checks · the About line (copy the one-liner above) |

## Shipped so far — one line per feature

- **Platform core** — raw store with labels failing closed · idempotent event log · tri-state health; 13/13 against real Postgres from a fresh `npm ci`
- **Connector contract + filedrop** — replay-safe by construction; the Phase-1 exit test (replay changes nothing) is a permanent CI assertion
- **Self-checking docs** — the full decision record (ADR-0001…0020), agreed execution plan, RD process; `check-docs` fails CI on drift, broken links, stale renders
- **The agentic workshop** — CI merge gate (test · docs · gitleaks) · push-a-branch-opens-a-PR (`auto-pr`) · worktree per PR · template-shaped commit bodies

## How a new agent picks up the baton

1. **Read this file** — you now know where work stands and what's blocked on whom.
2. **Read [AGENTS.md](AGENTS.md)** — 15 load-bearing rules; agree-first (12) and no-RD-no-branch (15) bite hardest.
3. **Read the active stage's RD** in [06-requirements/](06-requirements/README.md) — "done" is defined there, as CI assertions.
4. **Skim the [execution plan](03-reference/execution-plan.md)** — the agreed order; never re-sequence it silently.
5. **Check open PRs before starting:** `git ls-remote origin 'refs/pull/*/head'` — a previous agent's branch may hold the file you're about to touch.
6. **Work per ADR-0018/0019/0020:** one worktree per branch (`s<stage>/…`, `docs/…`, `fix/…`) · push and the PR opens itself · the operator merges, never you · credentials come from the operator's hand-off file, never chat, never committed.
