---
title: "ADR-0015: Markdown is canonical; HTML renders are generated artifacts with a freshness checker"
status: accepted
date: 2026-08-01
agreed-with: zeeshan — explicitly
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0015 — Markdown is canonical; HTML renders are generated artifacts

## Context
The folder mixed two kinds of files: agent-facing markdown (the source of truth) and human-facing HTML specs (presentations). Mixed together they clutter, and worse, they drift — a fact fixed in one place silently survives in the other.

## Decision
- The markdown docs are the **only** source of truth. The HTML files live in **`renders/`** and are *outputs* — never edit a fact in a render; fix the doc, regenerate, restamp.
- **`renders/MANIFEST.json`** maps every render to its source docs and its `rendered_at` date.
- **`tools/check-docs.mjs`** (zero dependencies) enforces it: front-matter present, relative links resolve, ADR index matches the files both ways, every render manifested, and a render is **STALE (build fails)** when any source doc is newer than it. Docs untouched for 180 days get a staleness *warning* — stale-by-default honesty.

## Rejected
- **Agent docs only** (retire the HTML) — zero drift risk but loses the visual layer that carries real communication value.
- **Leave mixed, rely on discipline** — discipline is what drift eats first; the predecessor study proved it at scale.
- **Full docs-site generator now** (Starlight/MkDocs) — right eventually, in the monorepo; premature for a planning folder.

## Consequences
Easy: `node tools/check-docs.mjs` answers "is anything lying?" in one command; CI runs it on every PR once the repo exists. Hard: regenerating a render is a manual step — the checker makes forgetting loud instead of silent.
