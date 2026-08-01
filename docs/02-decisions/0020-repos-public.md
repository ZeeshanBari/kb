---
title: "ADR-0020: Repos are public — free enforced protection, no committed ciphertext"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0020 — Repos are public: free enforced protection, no committed ciphertext

## Context

ADR-0014 chose private GitHub. At stage 0 the constraint surfaced: GitHub Free does not *enforce* branch protection on private repositories — a red PR could technically merge, hollowing out RD-0's exit test. The operator flipped both repos **public** at RD-0 agreement to get hard enforcement at zero cost. The platform code and docs contain no company data and no secrets.

## Decision

`kb` and `kb-deploy` are **public**. Three consequences accepted and bounded:

1. **Nothing credential-shaped is committed, even encrypted.** ADR-0019's `secrets/dev.enc.yaml` is deferred until a private home or the first real CI secret exists; until then values live only in gitignored `.env` files and the operator's hand-off file. Publishing ciphertext of live credentials to the world is a risk with no offsetting benefit.
2. **`kb-deploy` returns private before any company-specific configuration lands in it (stage 1 pre-condition).** The deploy repo is where company reality lives, and company reality is never public.
3. **Company facts never enter `kb`.** Fixtures and examples stay synthetic; gitleaks runs in CI from commit #1; the label discipline applies to documentation too.

ADR-0014's monorepo + tiny-deploy-repo structure stands; only its visibility clause is superseded.

## Rejected

- **GitHub Pro (≈ CA$5.60/mo) to keep repos private** — enforcement was the only Pro feature needed today; public buys it free and makes the platform open-sourceable, which the no-company-data rule already required in spirit.
- **Private + discipline-only merging** — a gate that isn't enforced isn't a gate; that was the lesson the five gates exist to encode.

## Consequences

Easy: hard merge gates from day one; a public, portfolio-grade history. Hard: absolute discipline that company facts never enter `kb`; the `kb-deploy` privacy flip is a hard stage-1 pre-condition (recorded in that RD when written). Exit path: flip visibility back to private + GitHub Pro — a settings change, no code change.
