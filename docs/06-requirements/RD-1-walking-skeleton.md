---
title: "RD-1: The walking skeleton, on the real box"
status: proposed
updated: 2026-08-02
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# RD-1 — The walking skeleton, on the real box

## Goal

The system exists in production before it has features: the compose bundle runs on a real Hetzner box with the secrets vault, tri-state status page, nightly backups to R2, and a scripted restore — so **install = restore is proven while there is nothing to lose**, and every later stage deploys the day it's done.

## Scope

- **In:** compose bundle (app · worker · postgres · caddy) · minimal `kb deploy` (build, push image, converge the box — Tailscale-only, **no public port**) · secrets vault in Postgres + the recovery-key ceremony (ADR-0011; needed before the first token arrives in stage 2) · status page rendering tri-state checks (incl. backup freshness + cursor placeholders) · pgBackRest → R2 nightly · the restore drill, scripted and run once for real · `kb-deploy` **flips private** (ADR-0020 pre-condition) and receives its first real content (compose pins + box record).
- **Out (deliberately):** any connector (stage 2) · public 443 + login (stage 4) · the wizard (stage 9) · the mini (track P).

## Exit tests — written first, as the CI assertions they become

| # | Assertion (runnable, binary) | Where it runs |
|---|---|---|
| 1 | **Destroy the box → `kb restore` onto a fresh one → status page green, secrets intact** | scripted drill, run live once; monthly thereafter (stage 10 rhythm) |
| 2 | Recovery-key ceremony completes; the key re-derives the vault on the restored box | part of drill #1 |
| 3 | A nightly backup object exists in R2 and is newer than 24h — surfaced as a tri-state check that *fails* when stale and is *unverifiable* when R2 is unreachable | status page + CI compose smoke |
| 4 | `kb deploy` from a clean clone converges an empty Ubuntu box to green with no manual steps beyond the documented 🔑 items | first real deploy; nightly compose-level in CI |

## Delivers

`deploy/compose.yaml` + Caddyfile · `kb` CLI (`deploy`, `restore`, `status`) · vault schema + ceremony · status page (web, Tailscale-only) · pgBackRest config → R2 · drill script · `kb-deploy` seeded for real (private).

## Boundaries & test pyramid (ADR-0022)

| Tier | This stage |
|---|---|
| Layers/edges touched | `app` is born (status page — imports `platform` only) · `deploy` + `kb` CLI (imports `platform` only) · vault lives inside `platform` · **no new edges; matrix unchanged** |
| Unit | vault crypto round-trip, wrong-key fails closed · converge planner pure logic (planning twice yields the identical plan) · backup-freshness verdict mapping (fresh / stale / unreachable → ok / fail / unverifiable) |
| Integration (real PG) | vault store→retrieve→re-derive against real Postgres · status checks reading real tables |
| Contract | every converge step idempotent — applied twice, the second is a no-op, asserted per step · R2 contract probe: write → read → delete one object |
| E2E | **the exit test is the E2E**: destroy the box → `kb restore` → status green, secrets intact · nightly compose-level deploy smoke in CI |

## Hardening (ADR-0022)

| Failure mode | Tri-state check watching it | Cap / limit |
|---|---|---|
| Backup silently stale or missing | backup-freshness check — *fail* when >24h, *unverifiable* when R2 unreachable; never a silent green | — |
| Vault key lost with the box | recovery-key ceremony unskippable (ADR-0011); the drill proves re-derivation for real | — |
| Box exposed before auth exists | Tailscale-only at this stage — no public port until stage 4 | compose publishes no public ports |
| Deploy tooling sprawl / drift | `kb deploy --plan` shows every converge step before apply (ADR-0012) | steps enumerated, reviewed in PRs |

## Depends on

Stage 0 done ✓ · 🔑 **Hetzner API token** and 🔑 **Cloudflare R2 keys** in the hand-off `.env` (see `../03-reference/credentials-manifest.md`) · 🔑 `kb-deploy` flipped private (operator click, ~5 s) · box cost begins: CX42 ≈ CA$26/mo (ADR-0002).

## Risks & rollback

Biggest risk: deploy tooling sprawl — contained by the converge-CLI decision (ADR-0012, plan over apply, idempotent steps). Rollback: destroy the box — nothing real is lost by definition at this stage; that fact is exactly what exit test 1 exploits.

## Sign-offs

- RD agreed (gate 1): _pending_ — operator
- Stage signed off (after gate 5): _pending_ — operator
