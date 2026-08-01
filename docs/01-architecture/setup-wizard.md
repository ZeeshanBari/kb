---
title: The setup wizard
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# The setup wizard — every question, and why it earns its place

Form factor per **ADR-0013**: two browser phases, zero native apps. Visual spec with all 16 screen mockups: `../renders/kg-wizard-proposal.html`.

## Phase 1 — the launcher (`npx kb@latest`, localhost, ~12 min)

| Screen | Asks | Validates |
|---|---|---|
| Welcome | nothing — a readiness checklist (domain, card, Slack + Google admin, Anthropic) | — |
| Where | tier (rent Hetzner default / BYO SSH / home) + Hetzner token or SSH address | live datacenter list / SSH probe |
| Address | `kb.<domain>` + Cloudflare token (R2 Edit + DNS Edit) | DNS record live; R2 bucket write |
| Company | name · workspace domain (= login allowlist) · timezone (auto) · display currency (CAD) | shape only; proven at Google connect |
| Options | mini (off) · watchers (on) · kanban (none) | — |
| Create | nothing — shows the plan + cost, then live provision progress; ends with one-time admin URL | every provision step verified |

## Phase 2 — the wizard (kb.domain/setup, ~30 min, resumable checklist)

| Step | Asks | Verified by | Skippable |
|---|---|---|---|
| 1 Claim | your name | one-time URL burns on use | no |
| 2 Recovery key | re-type last 4 chars | match | **never** |
| 3 Claude | Anthropic key + daily cap (CA$5 default) | one real Haiku call, cost shown | yes → search-only mode |
| 4 Slack app | bot + app tokens (via our pre-filled manifest link) | auth.test + live socket | yes |
| 5 Channels | all-public (default) or pick; label pills per channel | first cursor moves, live counts | defaults |
| 6 Google | client ID + secret (guided GCP setup) → OAuth connect → Drive folders + labels → enable SSO | OAuth round-trip; folder listed | yes → admin-key login stays |
| 7 Mac mini | nothing typed — enroll script + FDA deep-link | Tailscale heartbeat + real chat.db schema read | optional |
| 8 Watchers | healthchecks key · Sentry DSN | real ping · real test event | yes, nagged |
| 9 First knowledge | sheet picker + amount/date columns → confirm the number · 3 golden questions | metric runs; human confirms on sight | yes, to-do |
| 10 Backfill | 90d / 1y (default) / all — with live cost math from real message counts | finish enabled only when a cursor has moved | — |

**Totals:** 19 questions — 12 paste-a-value, 5 choices with safe defaults, 2 free text.

## Rules the wizard obeys

- **Verify before green** — every credential proven by a real effect (a call, a ping, a listed folder), never by key-shape.
- **Every green tick becomes a permanent check** that runs nightly forever — the wizard is the health system's first run, not onboarding chrome.
- **Resumable** — state in the database; close the browser anytime; every card reappears in Settings → Connections.
- **Nothing asked twice; nothing decided that has a safe default** — server size, ports, TLS, backup schedule are shown, not asked.
- **Teammates never see the wizard** — an invite link runs exactly one step: their own Google consent.
- **The recovery-key ceremony comes before any secret enters** (ADR-0011) and cannot be skipped.

## The wizard is the onboarding engine (ADR-0017)

The wizard is not install-day software. Each step above is a **card** owned by a feature in the registry; a fresh install runs `onboard(feature)` over the whole registry, and an upgrade runs the *same function* over the delta the reconciler finds — so an existing user onboarding onto a new feature walks exactly the flow a new user would. New features arrive as `announced` (a "what's new" card + Slack DM), never auto-enable, and become `live` only when their cards are done and their `enableCheck` is green. Both journeys are driven end-to-end in CI nightly (fresh lane + N−1→N upgrade lane) and end in one shared contract suite.
