---
title: "ADR-0021: About-sync — the existing PAT backs the repo-description automation"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0021 — About-sync: the existing PAT backs the repo-description automation

## Context

The operator requires the repo About to always state what's implemented plus how much remains of the active stage. That line now lives in `STATUS.md` (updated every PR), but copying it into the About needs repository-administration rights that Actions' built-in `GITHUB_TOKEN` cannot hold, and the agent's sandbox gates the GitHub settings API. The agent proposed a separate admin-only token; **the operator chose to reuse the existing `kb-agent` PAT instead** ("copy the token I already gave you and use that for this").

## Decision

An `about-sync` workflow runs on pushes to `main` that touch `docs/STATUS.md` and copies the first `> Stage …` line into the repo description, authenticated by the **`REPO_ADMIN_TOKEN` Actions secret, whose value is the existing kb-agent PAT** — installed by the operator (the sandbox gate prevents the agent from setting secrets). This **amends ADR-0019's "the PAT never enters CI" clause**, narrowed rather than discarded: the PAT may back repo-metadata automation only; it never appears in code, commits, or logs; test/build jobs never receive it (`permissions: {}` and no other consumer of the secret).

**Containment, stated plainly:** the secret is push-capable, and a workflow edit could read it — but every workflow edit reaches `main` only through a PR the operator merges. The merge gate is the containment. **Hardening path built in:** the workflow only names the secret, so swapping its value for an admin-only fine-grained token later requires zero code change — that swap remains the recommended eventual state.

## Rejected

- **Separate admin-only PAT** — safer scoping; operator declined for now (one token to manage). Remains the hardening path.
- **Manual About updates** — the operator explicitly wants it always current, automatically.
- **README-only status** — implemented too, but the About requirement stands on its own.

## Consequences

Easy: the About can never drift from STATUS.md; rotation touches one secret + the hand-off file. Hard: the operator must review workflow-file diffs in PRs with real attention — that click is the whole containment. Exit: swap the secret value (hardening) or delete the secret (workflow skips gracefully and the About goes manual).
