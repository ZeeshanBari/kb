---
title: "ADR-0017: Feature lifecycle — registry, feature_state flags, one onboarding flow"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0017 — Feature lifecycle: registry, feature_state flags, one onboarding flow

## Context

The execution plan (ADR-0016) is agreed and production users arrive in rungs, not at a launch day. The operator's requirements: a production user can start as soon as a rung opens; when a new feature is ready they are *informed* and walk an onboarding flow; everything is done once and properly; and **the onboarding flow for an existing user onto a new feature must be the same as for a new user** — with both scenarios testable end-to-end in CI. Signed off 2026-08-01.

## Decision

**A feature is a registry entry; the flag is a row.** Every feature declares itself in a code-reviewed registry: `{ key, version, needs, creds, cards, enableCheck }`. Per install, `feature_state(feature_key, state, version_onboarded, onboarded_at, onboarded_by)` in Postgres is the *only* flag store; code asks `isLive(key)` and nothing else. States: `shipped` (merged, deployed dark) → `announced` (web "what's new" card + Slack DM — informs, never auto-enables) → `onboarding` → `live` ⇄ `paused` (kill switch: one audited UPDATE, no deploy) → `retired`. A version bump re-enters `announced` with only the delta cards.

**One flow, because it is one function:** a fresh install runs `onboard(feature)` over the *whole* registry in dependency order; an upgrade runs the same `onboard(feature)` over the *diff* that the reconciler computes. The wizard (ADR-0013) is therefore the permanent onboarding engine, not install-day software — stage 9 assembles cards that stages 2–8 already built. Cards are idempotent, resumable converge steps; `live` requires every card done *and* the tri-state `enableCheck` green (the same check the status page runs nightly forever).

**Both scenarios proven in CI:** lane A (fresh: clean env → `kb install --answers` fixtures → onboard everything via the wizard API) and lane B (upgrade: install release N−1 + seed data → upgrade to N → assert exactly the delta is announced and data intact by row counts + checksums → onboard the delta via the same API). Both lanes end in **one shared post-onboarding contract suite** — if the flows ever diverge, a lane goes red. Cadence: per-PR unit/integration/check-docs; nightly both lanes on compose; weekly + pre-release lane A on a real throwaway Hetzner box. Lane B activates at the first tagged release (end of stage 1).

**Production rungs** (each = a stage exit test + a bake of 7 consecutive green status-page days): search pilot after stage 4 · answers pilot after stage 6 · live actions after stage 8's shadow week · strangers after stage 9. Every pilot complaint becomes a golden question the same day.

## Rejected

- **Third-party flag service** (LaunchDarkly etc.) — a new external dependency and cost, and an outside service deciding what runs on the box; percentage rollouts are meaningless for single-install deployments.
- **Env-var flags** — flipping requires a redeploy; no per-feature onboarding state; no audit trail.
- **A separate upgrade wizard** — two similar flows drift apart, which is precisely what the operator's rule forbids; one function cannot diverge from itself.

## Consequences

Easy: merged ≠ enabled, so incomplete features ship dark safely; updates inform and never surprise; the unification claim is enforced by the build, not by memory. Hard: every feature must be expressed as cards + an enableCheck — no back-door enablement. Exit path: supersede this ADR; the `feature_state` table migrates trivially since it is plain rows.
