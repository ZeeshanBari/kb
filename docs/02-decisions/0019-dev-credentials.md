---
title: "ADR-0019: Dev credentials — SOPS+age is the truth, .env is generated, one key unlocks CI"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0019 — Dev credentials: SOPS+age is the truth, `.env` is generated, one key unlocks CI

## Context

Development and CI need credentials (GitHub PAT, Anthropic key, Hetzner token, R2 keys) *before* the stage-1 production vault (ADR-0011) exists — and those two populations never merge. The operator asked for a `.env` file, ideally with the same tokens usable by GitHub CI, and to think it through first. The stack table had already chosen SOPS + age with plain `.env` rejected as the source of truth. Signed off 2026-08-01.

## Decision

**One credential per consumer.** The agent, CI, and the mini each hold their own key. Nothing is mirrored: the agent's PAT never enters Actions secrets — CI uses its built-in, per-run `GITHUB_TOKEN`; if CI ever needs cross-repo access, a separate credential is minted for exactly that.

**The truth is `secrets/dev.enc.yaml`** — SOPS + age, committed encrypted in the repo. Versioned, auditable, one source. **`.env` exists as a generated, gitignored convenience**: `sops -d --output-type dotenv secrets/dev.enc.yaml > .env`, loaded in dev via Node's native `--env-file`. It is a decrypt artifact — never hand-edited truth, never committed. A committed **`.env.example`** documents every variable (name, provenance, scope — no values). **CI holds exactly one secret, `AGE_KEY`**, and decrypts what a job needs from the repo itself. The age private key lives in the operator's password manager + that one CI secret — it is the only secret-zero, and the only string a fresh agent session needs.

**Bootstrap hand-off (amends ADR-0018):** until the repo and SOPS exist, a gitignored `.env` at the docs-folder root on the operator's Mac is the hand-off channel — the operator pastes tokens there and the agent reads it over the file bridge, keeping secrets out of the chat scrollback. ADR-0018's "re-pasted per session / never written to any file" clause narrows accordingly: **never in git-tracked files, never in chat when a file will do**; gitignored `.env` files and the encrypted `secrets/dev.enc.yaml` are the sanctioned homes. At stage 0 the values migrate into SOPS and the hand-off file is emptied.

**Guards:** `.env*` gitignored in every repo (with `!.env.example`) · `age-keys.txt` gitignored · a **gitleaks** job in CI from PR #1 (own the check; deterministic and free) · Actions masks secrets in logs · the 90-day PAT expiry stays.

## Rejected

- **Plain `.env` as the source of truth** — machine-local truth: a lost laptop or wiped agent workspace re-mints everything; syncing to Actions drifts; no history. (Already rejected in the stack table.)
- **GitHub Actions secrets as primary** — write-only by design; can't be read back, so local dev can't pull from it.
- **External secret manager** (Doppler / Infisical / 1Password CLI) — a paid external service in the middle of everything, against ADR-0006/0011/0012's grain.
- **Mirroring the PAT into CI** — a push-capable key inside the thing it can push to is a self-modification loop; revoking it would break two consumers at once.
- **git-crypt** — whole-file transparent encryption, but SOPS gives per-key diffs, is actively maintained, and pairs with age cleanly.

## Consequences

Easy: one string onboards any machine or agent session; secrets have git history without exposing values; CI configuration is one secret instead of N; the hand-off never touches chat. Hard: the sops/age key ceremony (once, ~2 minutes) and remembering that `.env` is disposable output. Exit path: the vault (ADR-0011) could absorb dev secrets post-stage-1 behind a `kb secrets` CLI; that would supersede this ADR.
