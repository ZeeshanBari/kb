---
title: "ADR-0018: The agentic workshop — PR structure, approval auto-merge, scoped token"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0018 — The agentic workshop: PR structure, approval auto-merge, scoped token

## Context

The operator authorized agent push access to GitHub and worktree-based parallel work ("you should be able to push to my github and make gitworktrees"). The file bridge cannot complete git operations (conventions.md), so agents work from clones in their own workspace. The agree-first rule (AGENTS.md #12) must extend to code. Signed off 2026-08-01.

## Decision

**Structure.** One PR = one concern, ≤ ~400 changed lines as a guideline (bigger work becomes a stack, each PR green on its own). Branches: `s<stage>/<slug>` for stage work, `fix/<slug>`, `docs/<slug>`; one git worktree per PR at `wt/<branch>` so parallel agents never collide. Conventional commits (`feat(vault): …`). Every code PR names its RD ("no RD, no branch"); pure doc changes are marked `docs-only`. The PR body opens with the basmallah and contains: what changed (≤3 lines) · RD link · **exit-test evidence (green output pasted, not promised)** · docs touched in this same PR · risk + rollback · out of scope. Required checks: unit + real-Postgres + check-docs.

**Merge policy (operator's choice).** The operator's **approval is required on every PR**; once approval is given and CI is green, **auto-merge lands it** — no second click. The agent never merges without approval; the approval *is* the agreement moment. Branch protection enforces both requirements mechanically.

**Access.** Two private repos (`kb`, `kb-deploy`) created by the operator. A fine-grained PAT scoped to exactly those two — Contents R/W, Pull requests R/W, Workflows R/W, Administration R/W (branch protection only) — 90-day expiry, revocable in one click. The token is never written to any file, commit, or doc; it is re-pasted per agent session until the stage-1 secrets vault exists, then lives there like every other credential.

## Rejected

- **Agent merges unilaterally when CI is green** — removes the human gate entirely; CI can't judge intent.
- **Operator clicks merge himself on every PR** — proposed as the default, but the operator chose approval + auto-merge: the agreement already happened at approval; the second click adds latency, not safety. (Tightening back is a branch-protection toggle, not a code change.)
- **Broad all-repositories token** — more access than the task needs, only to save one repo-creation step.
- **SSH deploy keys** — per-repo write but cannot open PRs or set branch protection; may return later for CI-only credentials.

## Consequences

Easy: parallel agent work without collisions; every change arrives with its evidence and its docs; history stays reviewable in small pieces. Hard: discipline on PR size; the token ceremony repeats each session until the vault exists. Exit path: flip branch protection to operator-merges (no code change), or supersede for a GitHub-App-based bot identity if the workshop outgrows PATs.
