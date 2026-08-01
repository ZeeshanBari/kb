---
title: "ADR-0012: A converge CLI installer — not Terraform, not a bash script"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0012 — A converge CLI installer — not Terraform, not a bash script

## Context
"Infra as code" is the right instinct: declarative, versioned, testable. But our infrastructure is **three resources** (a server, a bucket, a DNS record) plus on-box setup — and the system already needs a converge engine for drift (reconcile) and upgrades. AOS v1's cautionary tale: a 6-stage bash installer that grew past 100 KB and drifted from the system it installed.

## Decision
One CLI — `kb` — where **install is the first run of the reconciler**: every step is *check → fix → verify*, so every command is idempotent, `--plan` prints the diff without acting (our `terraform plan`), and `--answers` makes it non-interactive. Provisioning calls vendor APIs (hcloud, Cloudflare) directly inside the same converge loop. Install, upgrade, drift-repair, and restore are one engine applied to different starting states.

## Rejected
- **Terraform/OpenTofu/Pulumi** — state-file custody handed to non-technical users, a second toolchain, and a second definition of "desired state" that *will* drift from the reconciler's — all for three resources.
- **Ansible** — Python + YAML sprawl; idempotence by convention rather than construction.
- **A bash script** — untestable, unresumable; the AOS v1 lesson.
- **Buy a PaaS** (Railway/Render templates) — 2–3× cost forever and the sovereignty boundary breaks (ADR-0002).

## Consequences
Easy: one mental model for install/upgrade/repair/restore; CI tests the real flow nightly on a throwaway box for pennies. Hard: we own ~hundreds of lines Terraform would have provided — in exchange for zero state files and one source of truth for desired state. If the resource count ever grows past a dozen, revisit Terraform *behind* the CLI.
