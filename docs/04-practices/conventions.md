---
title: Conventions
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Conventions

## Begin with the basmallah — بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

Every new document, deliverable, spec, and work session begins with the basmallah — *In the name of Allah, the Most Gracious, the Most Merciful* — for all knowledge and progress are granted from the One above the heavens and the earth. In these docs it appears as a quote line directly after the front-matter. In HTML deliverables it appears in the header. This is a standing convention, not a decoration.

**Every file format carries it appropriately:** markdown as a quote line after front-matter · code as a comment on line 1–2 · `.gitignore`/YAML/shell as a `#` comment · HTML in the header · pure JSON as the opening words of its `note` field. Only formats that structurally cannot carry it (lockfiles, binaries) are exempt — never contort a file for the convention, and never silently skip it where it fits.

## Working with agents — the file bridge and its limits

Agents working from the cloud reach this folder through a file bridge with two hard, by-design limitations. They are documented here so they are never a surprise:

1. **Agents cannot delete files here.** The bridge forbids deletion. The convention: an agent moves discards into **`_to_delete/`** at the folder root and says so; the operator empties `_to_delete/` whenever they wish. Anything in there is confirmed-safe to remove.
2. **Agents cannot complete `git commit` through the bridge** — git must unlink temporary object files, which is deletion. Repo operations therefore run either in the operator's own terminal, or from the cloud side when the operator provides a scoped access token.
3. **Credentials are handed over in a file, never in chat** (ADR-0019). A gitignored `.env` at this folder's root is the hand-off channel: the operator pastes tokens in; the agent reads it over the bridge; values migrate into `secrets/dev.enc.yaml` (SOPS + age) once the repo exists, and the hand-off file is emptied. `.env` files are decrypt artifacts or hand-off scratch — never committed, never the source of truth.

Neither limitation applies to agents running natively on the operator's machine.

## Writing
- **Language:** plain, brief, decisive. State the choice, then the reason.
- **Dates:** ISO — `2026-08-01`.
- **Prices:** CAD, marked ≈, with the conversion rate and date when converted (1 EUR ≈ 1.60 CAD · 1 USD ≈ 1.41 CAD as of Aug 2026).
- **Numbers about the business:** only ever from `metric_definition` — a doc never invents a company figure.
- **File names:** kebab-case; ADRs `NNNN-short-title.md`.

## Engineering conventions worth restating
- Model names, thresholds, and SLAs are config with consequences — changes re-run the relevant gate.
- Every estimate is labeled an estimate. Every figure carries its unit.
- Diagrams live as Mermaid sources in the spec build; rendered SVGs are artifacts, sources are truth.
