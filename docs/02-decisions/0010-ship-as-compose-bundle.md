---
title: "ADR-0010: Ship as OCI images + a Docker Compose bundle"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0010 — Ship as OCI images + a Docker Compose bundle

## Context
The system must be installable by others, on their machines, reproducibly. The prior spec ran two bare Node processes under systemd — optimal for one bespoke box, wrong for distribution: host-OS drift ("works on Ubuntu 24.04, not 22.04"), no pinned artifact, upgrades as re-runs of an installer.

## Decision
Distribute as **versioned OCI images** (app, worker) plus a **Compose bundle** (app · worker · postgres:17 · caddy) pinned by digest, with named volumes for Postgres and Caddy state. systemd's only remaining job is `restart=always` via Docker. The deployment directory (`kb.config.yaml`, compose file, env) is the instance; the images are the software.

## Rejected
- **Bare systemd for distribution** — the host OS becomes part of the product surface.
- **Kubernetes/Helm** — a control plane again (ADR-0001's reasoning, doubled).
- **Nix** — real reproducibility, tiny audience; steep cost for the people we want installing this.
- **Per-distro packages** (deb/rpm) — a build-matrix tax forever.

## Consequences
Easy: identical bytes everywhere; upgrade = new tag + converge; rollback = previous tag; CI tests the exact artifact users run; Tier-C (home server) comes free. Hard: one more layer (negligible on our workload). The processes, modules, and database are **unchanged** — this is packaging, not architecture.
