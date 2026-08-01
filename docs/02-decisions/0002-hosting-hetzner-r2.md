---
title: "ADR-0002: Hetzner CX42 + Cloudflare R2"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0002 — Hetzner CX42 + Cloudflare R2

## Context
RAM is the binding constraint (vectors); the budget target is tens of dollars, not hundreds. Team is in Toronto; the workload is latency-insensitive (model round-trips dominate).

## Decision
**Hetzner CX42** — 8 vCPU · 16 GB · 160 GB NVMe, Falkenstein, €16.40 ≈ **CA$26/mo** — plus **Cloudflare R2** for blobs and backups (zero egress, ≈ CA$3). Tailscale free tier links the mini. Infra total ≈ **CA$31/mo**.

## Rejected
- **AWS** (EC2+RDS+S3) — ≈ CA$210–280/mo for the same capability.
- **Fly / Railway / Render** — 2–3× per GB RAM.
- **Oracle free ARM** — free, but accounts get reclaimed without appeal; staging only.
- **The Mac mini as the server** — CA$0 and a single disk under a desk on a residential uplink.
- **Managed Postgres** — CA$30–85/mo to avoid one process; the tested restore is our job either way.

## Consequences
Easy: the price. Hard: EU residency (fine today). **Exit:** lift to a CPX-class box in Ashburn if NA residency is ever required — config, not architecture.
