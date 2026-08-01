---
title: Documentation rules
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# How we document — the practices themselves

These are the best practices this folder is built on. They apply to every doc added here.

## Structure
1. **Numbered folders express reading order** — vision → architecture → decisions → reference → practices → research.
2. **One topic per file.** If a file needs a table of contents, split it.
3. **Decisions live in ADRs, and ADRs are immutable.** Supersede, never edit. Rejected alternatives are mandatory — the *no*s teach more than the *yes*.
4. **README is the map.** Every file is reachable from it in one hop.

## Content
5. **Single source of truth per fact** — link, don't duplicate. Duplicated facts diverge; diverged facts lie.
6. **Write for the cold reader** — the next agent has none of your session's context.
7. **Contracts over descriptions** — "the cursor advances only after commit" beats three paragraphs about reliability.
8. **Mark what you haven't verified.** Prices carry ≈ and a date. Prefer generating stated system facts from the system itself.
9. **Brief beats complete.** A doc nobody finishes protects nobody.

## Process
10. **Docs update with the change, in the same commit.** Undocumented change = incomplete work.
11. **Front-matter always** — `title · status · updated · owner`; bump `updated` on every edit.
12. **`status: superseded`, never deleted** — history is data.
13. **Log notable changes in `CHANGELOG.md`** — newest first.
14. **Presentation artifacts regenerate from these sources** — when the HTML spec and this folder disagree, this folder wins.

## Renders & freshness (ADR-0015)

15. **Renders are generated.** Human-facing HTML lives in `renders/`, mapped to its sources in `renders/MANIFEST.json` with a `rendered_at` date. Facts are never edited in a render.
16. **The checker is the truth-keeper.** `node tools/check-docs.mjs` fails on: missing front-matter, broken relative links, ADR-index drift, unmanifested renders, and any render older than its sources. It warns on docs untouched for 180+ days.
17. **Regenerate on change.** Editing a doc that a render presents obligates regenerating that render and bumping its `rendered_at` — the checker makes forgetting loud.

## Where things go

| It's a… | It goes to |
|---|---|
| Reason the system exists / rule that never bends | `00-vision/` |
| How a part works | `01-architecture/` |
| Choice between alternatives | `02-decisions/` (new ADR) |
| Exact value, tool, SLA, term | `03-reference/` |
| Way of working | `04-practices/` |
| Human-facing presentation | `renders/` + a MANIFEST entry |
| Lesson learned, external study | `05-research/` |
