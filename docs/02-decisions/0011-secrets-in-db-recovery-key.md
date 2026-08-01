---
title: "ADR-0011: Secrets envelope-encrypted in Postgres, one recovery key"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0011 — Secrets envelope-encrypted in Postgres, one recovery key

## Context
SOPS-age-in-repo (fine for developers) fails for end users: it asks them to manage key files, and secrets kept only on the box mean a restored backup is a *broken* system — every connection dead until re-entered.

## Decision
Secrets are entered **once, through the wizard**, validated live, and stored **AES-256-GCM envelope-encrypted in Postgres** (QM's proven pattern, including `{current, fallbacks[]}` key rotation without re-encryption). The master key is generated at install and shown **once** as a recovery key the operator stores outside the system (password manager / printed). Backups therefore contain everything: **restore produces a working system**, and the recovery key is the single thing the user must keep.

## Rejected
- **SOPS for end users** — key-file custody pushed onto the least-equipped party.
- **Vault** — a service to run, unseal, and back up, for a dozen secrets.
- **Plain `.env` on the box** — excluded from backups → restores don't work; included → plaintext secrets in backups.
- **A cloud KMS** — a vendor dependency inside the sovereignty boundary.

## Consequences
Easy: one recovery key; working restores; rotation without downtime. Hard: the key ceremony must be unmissable in the wizard (confirm-before-continue). SOPS remains for developer/CI environments — different audience, different tool.
