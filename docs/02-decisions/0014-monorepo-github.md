---
title: "ADR-0014: One product monorepo + a tiny deploy repo, on private GitHub"
status: accepted
date: 2026-08-01
agreed-with: zeeshan — explicitly
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0014 — One product monorepo + a tiny deploy repo, on private GitHub

## Context
Research on documentation drift is unanimous: co-locating docs with the code they describe is the single strongest prevention — every behavior-changing PR becomes a natural doc update, enforceable with CODEOWNERS and CI. Our own rule ("docs update with the change, in the same commit") is only enforceable inside one repo.

## Decision
**Two repos, private, on GitHub:**
1. **`kb`** — the product monorepo: `platform/ app/ worker/ ui/ edge/ installer/ deploy/ starter-packs/ tools/` **and `docs/`**. This planning folder is the seed of that `docs/` directory and transplants in whole when code exists.
2. **`kb-deploy-<company>`** — the instance: `kb.config.yaml`, `answers.yaml`. Never secrets (ADR-0011 keeps those encrypted in the DB), so it is safely committable.

## Rejected
- **Polyrepo** (app/worker/ui/edge split) — loses atomic cross-cutting PRs; the same fragmentation rejected in ADR-0001.
- **GitLab** — equivalent, smaller ecosystem for our tooling (Actions, gh CLI); no existing preference to justify it.
- **Self-hosted Gitea/Forgejo** — another always-on service to run and back up, against our own rule; git being distributed already caps GitHub lock-in (every clone is a full copy).

## Consequences
Easy: one PR changes schema + connector + test + doc together; CI gates docs the same as code. Hard: monorepo CI needs path filters as the repo grows. Exit: any repo host works — the repo *is* the copy.
