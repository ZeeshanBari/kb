---
title: Install & portability
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Install & portability

**The claim:** anyone can go from nothing to a running, verified system in about 45 minutes of active time — and the architecture barely changes to make that true. The decisions we already made *are* the installability story; what changes is packaging, not structure.

## Why the skeleton already works

| Existing decision | Installability win |
|---|---|
| Modular monolith (ADR-0001) | 2 containers to start, not 20 services to provision |
| One database (ADR-0003) | One volume to back up, restore, and *move* |
| Slack socket mode (ADR-0005) | No public webhook URL needed before install finishes |
| Schema-as-code at boot (ADR-0004) | No migration step in the installer — first boot creates everything |
| Config-not-code (ADR-0008) | One `kb.config.yaml` is the entire instance identity |
| Health checks assert effects | The setup wizard *is* the health checks, run interactively |

## The four changes (the skin, not the skeleton)

1. **Packaging** — bare systemd processes → OCI images + a versioned Docker Compose bundle. ADR-0010.
2. **Secrets** — SOPS-in-repo → wizard-entered, envelope-encrypted in Postgres, one printed recovery key. ADR-0011.
3. **Installer** — a converge CLI (`kb`), not Terraform, not a bash script. ADR-0012.
4. **First-boot setup mode** — the app boots into a wizard behind a one-time admin URL; each connection is verified live before it turns green.

## The flow

```
npx kb@latest init      # 2 min — answers questions, or reads answers.yaml; writes the deployment dir
kb provision            # 5 min — Hetzner box · R2 bucket · DNS  (BYO-box installs skip this)
kb deploy               # 5 min — SSH in: docker, compose bundle, TLS via Caddy
# first boot: setup mode — schema self-creates; a one-time admin URL is printed
# browser: the wizard — connect Slack (app manifest), Google (OAuth), Anthropic key … ~30 min
kb doctor               # 2 min — full converge; every check green; recovery key confirmed
```

Every command is **idempotent** — running it twice changes nothing the second time. `--plan` prints the diff without acting (our `terraform plan`). `--answers file.yaml` makes the whole flow non-interactive, which is what makes it CI-testable.

## Install = upgrade = restore

All three are the same operation — the converge engine applied to different starting states:

| Operation | Starting state | Command |
|---|---|---|
| Install | empty box | `kb deploy` |
| Upgrade | running vN-1 | `kb upgrade` (new image tag → converge → boot migrations → exit checks) |
| Disaster recovery | backup + fresh box | `kb restore` (fetch from R2 → converge → verify counts) |

Because secrets live encrypted **inside** Postgres (ADR-0011), a restore restores a *working* system — connections included. The recovery key is the only thing the operator must keep outside the system.

## Deployment tiers (portability)

| Tier | Target | What differs |
|---|---|---|
| **A — Managed** | Hetzner via API token | CLI provisions everything |
| **B — BYO box** | any Ubuntu VPS with SSH | skip `provision`; point `kb.config.yaml` at the box |
| **C — Home/local** | Docker Desktop or home server | no public URL → access via Tailscale; Slack still works (socket mode is outbound) |

Same compose bundle in all three; only the provision step differs. That is the portability guarantee.

## Incremental enablement — boots useful with almost nothing

Every integration is optional; a missing credential disables a feature cleanly, never crashes the system.

| You've provided… | You now have |
|---|---|
| nothing (just the box) | web UI (admin URL), file upload ingest, FTS search |
| + Anthropic key | triage, extraction, answers on whatever's ingested |
| + Slack tokens | channels flowing through the funnel |
| + Google OAuth | SSO login, Drive + Gmail ingest |
| + Tailscale + a Mac | iMessage, WhatsApp, meeting audio |
| + healthchecks/Sentry | watched from outside |
| + Trello/Linear key | Act (phase 5) |

## Testing the installer (it's code, so it's tested)

- **PR CI:** `kb deploy` against a local Docker target; wizard driven through its API in test mode; asserts green.
- **Nightly:** the full flow against a **real throwaway Hetzner box** (cheapest tier, pennies/run) with `--answers ci.yaml`; asserts health; destroys the box.
- **Idempotence test:** run everything twice; assert the second run is a no-op.
- **Upgrade test:** install vN-1, upgrade to vN, assert data survives.
- **Restore-to-fresh-box:** the monthly drill, which doubles as the ultimate portability proof.

## What ships in the box (starter content)

Installable ≠ instantly knowledgeable. We ship starter packs the wizard installs: a default ontology (predicate list), template metric definitions to copy, and a golden-questions scaffold. The company's *truth* — its metrics, its labels, its golden-50 — is authored by humans over the first weeks. See `../03-reference/credentials-manifest.md` for exactly what we ask of the user and why.
