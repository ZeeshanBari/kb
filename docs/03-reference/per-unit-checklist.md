---
title: Per-company and per-mini checklist
status: current
updated: 2026-08-02
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# What each new company and each new Mac mini costs in human steps

Everything not listed here is automated by the converge installer / wizard (ADR-0012, ADR-0013). Human-only steps exist because a vendor requires a human (OAuth consent, app installs, Apple privacy prompts) — full credential detail in [`credentials-manifest.md`](credentials-manifest.md).

## Per company — one install

**Human-only, once (the wizard walks all of it — ≤ 60 min total, the stage-9 stranger test):**

| # | Step | Who | ~Time |
|---|---|---|---|
| 1 | Choose where it lives: rent Hetzner (default; account + API token) or BYO SSH box | company admin | 5 min |
| 2 | Domain + Cloudflare tokens (DNS edit + R2 edit) | admin | 5 min |
| 3 | **Recovery-key ceremony** — one named human stores it in a password manager; unskippable (ADR-0011) | the operator-to-be | 2 min |
| 4 | Anthropic key + daily spend cap (CA$5 default) | admin | 3 min |
| 5 | Slack app from our pre-filled manifest + pick channels + label pills per channel | Slack admin | 5 min |
| 6 | The Google sitting (stage-4 features): project · APIs · consent screen · OAuth client · Drive folders + labels · SSO allowlist domain | Google admin | 15 min |
| 7 | First knowledge: point at one Sheet, confirm one number on sight, seed 3 golden questions | someone who knows the business | 10 min |
| 8 | Backfill depth (90d / 1y / all — live cost math shown) | admin | 1 min |
| 9 | Watchers (healthchecks.io ping + Sentry DSN) — skippable, nagged | admin | 4 min |
| 10 | `kb-deploy-<company>` repo created **private** (pins · answers · runbook live there — never public, ADR-0020) | operator | 2 min |

**Automated per company (no human):** box provision · TLS · compose up · schema · vault init · pgBackRest → R2 + first restore drill · Tailscale mesh · status checks registered · teammate invites (each teammate: one Google consent click, nothing else).

**Recurring per company:** weekly review queues (identity + contradictions, ~15 min) · monthly restore drill (calendar) · token rotations on expiry (status page nags) · every wrong answer → a golden question, same day.

## Per Mac mini — each edge box (track P)

**Human-only, once per mini (Apple requires the human):**

| # | Step | Why human |
|---|---|---|
| 1 | Plug in, network, never-sleep (it's a server now) | physical |
| 2 | Run the enroll one-liner from wizard screen 7 | terminal on that Mac |
| 3 | **Grant Full Disk Access** to the agent (deep-link opens System Settings) — required to read `chat.db` | macOS privacy prompt cannot be scripted |
| 4 | Tailscale login on the mini | device identity |
| 5 | If WhatsApp: link the session (QR scan from the paired phone) | WhatsApp's device model |
| 6 | Set macOS updates to a controlled window (auto-restarts kill the outbox) | judgement call |

**Automated per mini:** launchd agent install · SQLite outbox → `/ingest` over Tailscale · whisper + docling models pulled · chat.db schema probe · heartbeat check registered on the status page (a dead mini alarms; it never silently vanishes — ADR-0009).

**Recurring per mini:** nothing routine. After major macOS upgrades, re-confirm Full Disk Access if the heartbeat alarm fires.
