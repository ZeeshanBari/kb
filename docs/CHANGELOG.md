---
title: Documentation changelog
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Changelog

All notable changes to this documentation. Newest first.

## 2026-08-02 (stage 0 — closed)
- **Stage 0 signed off by the operator** after live gate demonstrations: the deliberately-red PR #3 was blocked from merging and closed unmerged (RD-0 exit test 2); `about-sync` set the repo About on PR #2's merge (ADR-0021 proven end-to-end); auto-PR proven twice (~20 s push-to-PR). RD-0 stamped `done`.
- **RD-1 (walking skeleton) proposed** — compose bundle on a real Hetzner box, secrets vault + recovery-key ceremony, pgBackRest → R2, destroy-and-restore exit test. Awaiting operator agreement; stage-1 🔑 items: Hetzner token + R2 keys, `kb-deploy` → private.
- Probe branch and merged work branches deleted; STATUS flipped to done.

## 2026-08-01 (agent navigation)
- **`STATUS.md` added — the baton.** One-line status (mirrored in the repo About), remaining-in-stage table, shipped-features list, and the 6-step boot order for any new agent. Every PR that changes what's true updates it.
- Repo root gains a thin `CLAUDE.md` (auto-loaded agent entry point → `docs/`) and a `CHANGELOG.md` signpost; the repo README now opens with the live status line. Full content stays in `docs/` — root files are signposts, never sources.
- **ADR-0021 accepted** — `about-sync` workflow mirrors STATUS.md's one-liner into the repo About on every merge that touches it, backed by the `REPO_ADMIN_TOKEN` secret (the existing PAT, by the operator's explicit choice — amending ADR-0019's PAT-never-in-CI clause; containment = the operator's merge gate; hardening path = swap the secret value for an admin-only token, zero code change).

## 2026-08-01 (stage 0 — the repo gate)
- **Commit #1 is on GitHub** — `kb` seeded with the Phase-1 platform (13/13 from a fresh `npm ci`), the full docs tree as `docs/`, and CI as the merge gate (test · real-Postgres · check-docs · gitleaks). `kb-deploy` seeded as a placeholder.
- **ADR-0020 accepted** — the operator flipped both repos public at RD-0 agreement (GitHub Free doesn't enforce protection on private repos): enforcement is now free and hard; nothing credential-shaped is committed even encrypted (ADR-0019's SOPS file deferred); `kb-deploy` returns private before company config lands (stage-1 pre-condition). Supersedes ADR-0014's visibility clause.
- **RD-0 agreed** (gate 1) with the public-repos amendment; PR #1 carries this record — the first gated change.
- **Auto-PR workflow added** — pushing a `s*/`, `docs/`, or `fix/` branch opens its own PR with GitHub-side credentials (the sandbox's API gate is bypassed by design, not circumvented: git push is the agent's one open door, and the repo turns pushes into PRs). CI now runs on work-branch pushes so the checks attach to the same commit. PR creation is agent-autonomous; merging remains the operator's click.

## 2026-08-01 (dev credentials)
- **ADR-0019 accepted** — dev/CI credentials: `secrets/dev.enc.yaml` (SOPS + age, committed encrypted) is the truth; `.env` is a generated, gitignored convenience; CI holds one secret (`AGE_KEY`); the agent's PAT never enters CI (one credential per consumer). Bootstrap hand-off = a gitignored `.env` on the operator's Mac read over the bridge — amends ADR-0018's paste-in-chat clause.
- conventions.md bridge section gains rule 3 (credentials hand-off) · root `.gitignore` now ignores `.env*` (keeps `.env.example`) and age keys · kb code seed gains `.gitignore` + `.env.example`.

## 2026-08-01 (ship & onboard)
- **ADR-0017 accepted** — feature registry in code; `feature_state` rows in Postgres are the flags (no third-party service); one `onboard()` function serves fresh installs (whole registry) and upgrades (the delta) — the operator's one-flow rule made structural; dual-lane E2E in CI ending in one contract suite; production rungs with the 7-green-day bake.
- **ADR-0018 accepted** — agentic PR structure (one concern, RD-linked, evidence in the body, docs in the same PR, worktree per branch); merge policy per the operator: approval required, then auto-merge on green CI; GitHub access via a fine-grained token scoped to `kb` + `kb-deploy` only.
- AGENTS.md rule 15 added (PR conduct) · setup-wizard.md gains "the wizard is the onboarding engine" · render `kg-ship-and-onboard.html` added.

## 2026-08-01 (execution plan)
- **ADR-0016 accepted** — reviewed together and approved: eleven stages + a parallel mini track, five gates per stage, requirement docs before code ("no RD, no branch"). Canonical text: `03-reference/execution-plan.md`; render `renders/kg-execution-plan.html` (banner flipped PROPOSED → AGREED).
- **New:** `06-requirements/` — the RD process and `RD-template.md`; `tools/check-docs.mjs` now scans it.
- `03-reference/build-order.md` superseded — kept as a pointer stub; its phases map into the stages.

## 2026-08-01 (conventions)
- Basmallah gaps closed: `.gitignore` (comment) and `renders/MANIFEST.json` (note field); conventions.md now states exactly how every file format carries it.
- **Documented the file bridge's limits** in conventions.md: cloud agents cannot delete here (hence `_to_delete/`) and cannot complete git commits (hence terminal or token). No more mystery folders.

## 2026-08-01 (structure)
- **ADR-0014 accepted** — one product monorepo (`kb`, docs travel with code) + tiny `kb-deploy-<company>` repo, private GitHub. This folder is the seed of `kb/docs/`.
- **ADR-0015 accepted** — markdown canonical; HTML moved to `renders/` with `MANIFEST.json`; `tools/check-docs.mjs` enforces links, front-matter, ADR-index sync, and render freshness.
- **Unified the tree** — an earlier split had docs at both root and `docs/` (agent path error after the operator flattened the folder); merged to one root-level tree, `docs/` retired to `_to_delete/`.
- Retired: the early AOS-v1 study files and the first architecture HTML — distilled content survives in `05-research/` and the three current renders.

## 2026-08-01 (wizard)
- **ADR-0013 accepted** — the first decision under the agree-first rule, explicitly signed off: the install wizard is two browser phases (local launcher + system-served wizard), zero native apps. Native Mac app, hosted click-to-deploy, and pure CLI rejected.
- **New:** `01-architecture/setup-wizard.md` — all 19 questions, validations, skip rules; visual spec `../kg-wizard-proposal.html`.
- **AGENTS.md rule added:** agree before deciding — ADRs are proposed, signed off, then recorded. ADR-0001–0012 stand as accepted by the operator's explicit choice.

## 2026-08-01 (later)
- **ADR-0010/0011/0012 added** — packaging as a Compose bundle; secrets envelope-encrypted in Postgres with one recovery key; the converge CLI installer (Terraform rejected).
- **New:** `01-architecture/install-and-portability.md` — the install flow, tiers, degradation ladder, install=upgrade=restore, installer testing.
- **New:** `03-reference/credentials-manifest.md` — every credential we ask for, exact scopes, what only humans can do, the answers-file schema.
- README map updated; companion `kg-install-spec.html` added.

## 2026-08-01
- **Created** the full documentation set: vision, architecture (4), decisions (ADR 0001–0009), reference (4), practices (2), research (2), AGENTS.md.
- **ADR-0009** added: the Mac mini is transport, not a second pipeline — prompted by a review question about the system map.
- Source material: the AOS v1 audit, the QM (Y Combinator) study, the GraphRAG/LazyGraphRAG research, and the architecture sessions of 2026-07-31 → 2026-08-01.
