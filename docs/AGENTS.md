---
title: Rules for AI agents
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# AGENTS.md — rules for any agent working here

These rules are load-bearing. They exist because we studied a 176k-line system (AOS v1) whose recurring failure was *"structurally complete but functionally unwired, while monitors read green."* Every rule below traces to a real failure.

## The rules

1. **Begin with the basmallah.** Every new document, deliverable, and work session starts with بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ — all progress comes from the One above the heavens and the earth. See `04-practices/conventions.md`.
2. **Read before you write.** `README.md` → the relevant `01-architecture/` file → the ADRs it links. Never work from memory of a previous session when a doc exists.
3. **ADRs are immutable.** Never edit an accepted decision. If you believe a decision is wrong, write a new ADR that supersedes it and links back. The history of *why* is as valuable as the decision.
4. **Never silently contradict an accepted ADR.** Code or docs that conflict with an ADR is a bug — either fix the work or supersede the ADR, explicitly.
5. **Docs update with the change, in the same commit.** A change without its doc update is incomplete work. Do not leave documentation debt silently; log it in `CHANGELOG.md` if you truly must defer.
6. **One source of truth per fact.** Link, don't duplicate. If a number or rule lives in two files, one of them is already wrong.
7. **Never state what you haven't verified.** Mark unverified claims as such. Prices carry ≈ and a date. If a doc claims system state, prefer generating it from the system over asserting it in prose (the `aos snapshot` lesson).
8. **Small diffs.** Don't reformat wholesale, don't rename headings without need — reviewability is a feature.
9. **Front-matter is mandatory** (`title`, `status`, `updated`, `owner`) and `updated` bumps on every edit. `status: superseded` docs are kept, never deleted.
10. **Keep the map current.** If you add a file, add it to `README.md`'s table and to `CHANGELOG.md`.
11. **Write for a cold reader.** The next agent has zero context from your session. If understanding your change requires the conversation that produced it, the doc has failed.
12. **Agree before deciding.** From ADR-0013 onward, no ADR is written as `accepted` without the operator's explicit sign-off — propose, ask, then record. (ADR-0001–0012 predate this rule and stand by his choice.)
13. **When you learn something, file it.** New lesson → `05-research/`. New rule → here or `04-practices/`. New choice → a new ADR. Understanding that lives only in a chat transcript is understanding lost.

14. **Renders are outputs, never sources.** The HTML files in `renders/` are generated presentations of agreed docs. Never edit a fact there — update the doc, regenerate the render, update `renders/MANIFEST.json`, and run `node tools/check-docs.mjs` before finishing (it fails on stale renders, broken links, missing front-matter, and ADR-index drift).

15. **PRs follow ADR-0018.** One concern per PR, RD-linked (no RD, no branch), exit-test evidence pasted in the body, docs updated in the same PR, conventional commits, one worktree per branch. Never merge without the operator's approval; with approval + green CI, auto-merge lands it. Tokens and credentials never enter a file, commit, or doc.

## Quick map for agents

| I need to… | Go to |
|---|---|
| Understand the system | `01-architecture/system-overview.md` |
| Know why X was chosen over Y | `02-decisions/` |
| Find the exact tool/SLA/phase | `03-reference/` |
| Add a decision | `02-decisions/README.md` (template inside) |
| Follow doc style | `04-practices/documentation-rules.md` |
| Check docs health / freshness | `node tools/check-docs.mjs` |
