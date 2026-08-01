---
title: "ADR-0005: Web app + Slack bot — not desktop"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0005 — Web app + Slack bot — not desktop

## Context
A multi-user company tool. AOS v1's desktop client was retired with 13 of 18 screens empty — the cautionary tale.

## Decision
Responsive **web app** behind Google OIDC (workspace-domain allowlist) + the **Slack bot** (socket mode — answers arrive where questions are asked; zero public ingress beyond 443).

## Rejected
- **Desktop app** — signing, updates, per-OS builds, no shareable evidence URLs.
- **Native mobile** — responsive web covers the read paths.
- **CLI-first** — comes free later; same API.

## Consequences
Easy: "send a colleague a link to the evidence" — the judgment criterion for a knowledge base. Hard: nothing. **Exit:** none needed; surfaces are thin clients of one API.
