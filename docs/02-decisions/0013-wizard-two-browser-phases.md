---
title: "ADR-0013: The install wizard is two browser phases — zero native apps"
status: accepted
date: 2026-08-01
agreed-with: zeeshan — explicitly, per the agree-first rule
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0013 — The install wizard is two browser phases — zero native apps

## Context
The wizard's real work is OAuth flows and credential entry, and OAuth lives in the browser by design (Google blocks embedded webviews). The only open question was what runs the first ten minutes, before a server exists. First decision made under the agree-first rule.

## Decision
**Phase 1 — the launcher:** `npx kb@latest` serves a local web UI in the user's browser; 6 screens collect the pre-server answers, then provision + deploy with live progress. **Phase 2 — the wizard:** served by the system itself at the real domain, first-boot setup mode behind a one-time admin URL; a 10-step resumable checklist where every credential is verified live before turning green, and every green tick becomes a permanent nightly check. Same React components in both phases. The Mac mini needs only an enroll script + a guided Full-Disk-Access page — no installer app.

## Rejected
- **Native Mac installer app** — signing/notarization/update pipeline for ten minutes of use; excludes non-Mac installers; OAuth bounces to the browser anyway.
- **Hosted click-to-deploy** — we'd hold users' cloud tokens and run always-on infra; sovereignty breaks. A legitimate future business layer, wrong v1.
- **Pure CLI prompts** — hostile to the audience; phase 2 needs the browser regardless.

## Consequences
Easy: nothing to sign or update; launcher and wizard share components; CI drives the wizard through its API with `--answers`. Hard: the launcher must handle "browser closed mid-provision" (it does — idempotent re-runs). Full screen-by-screen spec: `../01-architecture/setup-wizard.md` and `../renders/kg-wizard-proposal.html`.
