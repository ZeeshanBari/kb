---
title: Credentials manifest
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Credentials manifest — everything we ask of the user, and why

The contract: **the CLI automates everything a machine is allowed to do; the wizard verifies every credential live before marking it green; and the list below is exhaustive.** If setup ever asks for something not on this list, that's a bug.

## The credentials

| # | Credential | Enables | Who can create it | The manual part | Then automated | Stored |
|---|---|---|---|---|---|---|
| 1 | Hetzner API token | Tier-A provisioning | account owner | create account + token (~3 min) | box creation, resize | CLI only — never on the server |
| 2 | Domain (+ DNS) | TLS, OIDC, evidence links | domain owner | buy it; if the zone is on Cloudflare the CLI sets records | A-record, renewal-safe | config |
| 3 | Cloudflare API token | R2 bucket (+ DNS if hosted there) | account owner | create token: R2 Edit (+ DNS Edit) | bucket, lifecycle, access keys | R2 keys → encrypted in DB |
| 4 | Anthropic API key | triage · extraction · answers | billing owner | console + card; set a vendor-side monthly limit too | validated with one live call; our gateway caps daily | encrypted in DB |
| 5 | Slack bot token + app token | channel ingest + the bot | **workspace admin** | create the app **from our shipped manifest** (paste JSON → install → copy 2 tokens, ~3 min) | `auth.test`, channel list, cursor start | encrypted in DB |
| 6 | Google OAuth client | SSO login · Drive · Gmail | **Workspace admin** | GCP project → enable Drive+Gmail APIs → consent screen (Internal) → Web client with our redirect (~10 min) | each account connects with one OAuth click in the wizard | client secret + refresh tokens encrypted in DB |
| 7 | Tailscale login | mini ↔ VPS link | anyone (free) | log in on both machines | — | tailscaled state |
| 8 | healthchecks.io key | external dead-man | anyone (free) | create account + project (~2 min) | checks created via API | encrypted in DB |
| 9 | Sentry DSN | exception grouping | anyone (free) | create project (~2 min) | — | config |
| 10 | Trello key+token / Linear key | Act (phase 5) | board admin | generate in settings | validated on entry | encrypted in DB |
| 11 | Mac mini enrollment | iMessage · WhatsApp · audio | **a human at the Mac** | run the enroll script; approve **Full Disk Access**; Tailscale login | outbox sync, transcription | device keypair on mini |

**Slack scopes (exact):** `channels:history channels:read groups:history groups:read im:history mpim:history users:read users:read.email chat:write reactions:write files:read` + app-level `connections:write`.
**Google scopes (exact):** `openid email profile` · `drive.readonly` · `gmail.readonly`.

## What only a human can ever do — and why

| Task | Why it can't be automated |
|---|---|
| Create vendor accounts and attach billing | identity + payment are human acts |
| Click OAuth consent | that consent *is* the security model |
| Create the Slack app (one manifest paste) | Slack requires an admin session by design |
| Approve Full Disk Access on the Mac | Apple's TCC requires GUI consent, deliberately |
| Buy/control the domain | ownership is legal, not technical |
| Invite the bot to private channels | Slack privacy model — correct behavior, not a limitation |
| Choose labels, admins, and which channels to ingest | governance decisions belong to the company |
| Author metric definitions and golden questions | this is the company's *knowledge* — starter packs help, truth is theirs |

## The answers file (what you'll be asked, as a schema)

`kb init --answers answers.yaml` makes install non-interactive and CI-testable. The same schema documents every question setup will ever ask:

```yaml
tier: managed | byo | home
domain: kb.example.com
region: fsn1            # or a BYO host: { ssh: root@1.2.3.4 }
company: { name: …, workspace_domain: example.com }
features: { mini: false, sentry: true, healthchecks: true, kanban: none }
# secrets are NEVER in this file — they are entered in the wizard or piped from env in CI
```

## Degradation ladder

No credential is load-bearing for boot. The system starts with zero external credentials (admin URL + file-upload ingest + FTS search) and each credential added unlocks its feature, verified live, one at a time. Absent credential = feature off, status page says so honestly — never a crash, never a silent halt.
