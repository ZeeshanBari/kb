---
title: "RD-0: The repo gate"
status: agreed
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# RD-0 — The repo gate

## Goal

Code stops living in zip files, permanently: the `kb` monorepo (code + docs) and `kb-deploy` exist on private GitHub, and every future change lands through a PR whose tests, docs checker, and secret scan ran in CI. The five-gate lifecycle (ADR-0016) becomes mechanical fact.

## Scope

- **In:** seed `kb` main with the Phase-1 platform (13/13 tests), the full docs tree as `docs/`, CI (unit + real-Postgres + check-docs + gitleaks), `.gitignore` + `.env.example`, the PR template (ADR-0018); seed `kb-deploy` minimal; branch protection (enforced — repos are public); PR #1 opened from a worktree branch as the first gated change, carrying ADR-0020.
- **Amended at agreement (operator flipped both repos public):** no credential is committed *even encrypted* — the PAT stays in the gitignored hand-off file; the SOPS/age machinery of ADR-0019 is deferred until a private home or the first real CI secret exists. Recorded as ADR-0020.
- **Out (deliberately):** all feature code (stage 1+) · any deploy (stage 1) · the wizard (stage 9).

## Exit tests — written first, as the CI assertions they become

| # | Assertion (runnable, binary) | Where it runs |
|---|---|---|
| 1 | The seed commit's CI run is green on all four jobs | GitHub Actions, `main` |
| 2 | A PR with a deliberately failing test shows **red** and does not get merged | Actions + merge gate (see risk below) |
| 3 | A PR that edits a render's source doc without regenerating fails `check-docs` | Actions, PR |
| 4 | Fresh `git clone` → `npm ci` → `npm test` is green (reproducibility from nothing) | any machine |

## Delivers

`kb` + `kb-deploy` populated · `.github/workflows/ci.yml` · `.github/pull_request_template.md` · `secrets/dev.enc.yaml` + `.sops.yaml` · PR #1 awaiting the operator.

## Depends on

PAT in the hand-off file (✓ received) · both repos created (✓ verified empty) · operator clicks for what the sandbox's API gate blocks: branch-protection setting, the `AGE_KEY` Actions secret, and opening/merging PRs from pushed branches (or the agent drives the operator's Chrome).

## Risks & rollback

**Risk (resolved at agreement):** GitHub Free doesn't enforce protection on *private* repos — the operator chose to flip both repos **public**, making enforcement free. Consequences owned: the platform code and docs are world-readable (they contain no company data and no secrets); `kb-deploy` returns **private before any company-specific config lands in it (stage 1)**. Single-identity note: with one GitHub account, "required approving reviews" would deadlock (authors can't approve their own PRs) — so the operator's approval *is* the merge click / auto-merge enablement, per ADR-0018's intent.
**Rollback:** both repos are deletable in one click each; nothing else exists yet; the docs tree and code remain intact locally.

## Sign-offs

- RD agreed (gate 1): **2026-08-01** — operator (with the public-repos amendment)
- Stage signed off (after gate 5): _pending_ — operator
