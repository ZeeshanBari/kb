# بسم الله الرحمن الرحيم

# CLAUDE.md — agent entry point (thin by design)

Everything an agent needs lives in [`docs/`](docs/README.md); root files are signposts, never sources. Boot order:

1. [`docs/STATUS.md`](docs/STATUS.md) — **the baton**: active stage, what's left, what shipped, who's blocked on whom
2. [`docs/AGENTS.md`](docs/AGENTS.md) — the 15 load-bearing rules
3. The active RD in [`docs/06-requirements/`](docs/06-requirements/README.md) — "done" is defined there, before code

Hard rules echoed for safety: begin everything with the basmallah · propose → agree → record every decision (never decide alone) · no RD, no branch · docs update in the same PR (`node docs/tools/check-docs.mjs docs` must stay green) · work in a worktree per branch (`s<stage>/…`, `docs/…`, `fix/…`) — pushing the branch opens its PR automatically · **never merge; the operator merges** · credentials come from the operator's hand-off file, never chat, never a commit.

Change log: [`docs/CHANGELOG.md`](docs/CHANGELOG.md) · Architecture: [`docs/01-architecture/system-overview.md`](docs/01-architecture/system-overview.md) · Every decision and its rejected alternatives: [`docs/02-decisions/`](docs/02-decisions/README.md)

## Session memory — sandbox facts every agent needs (the repo is the memory)

- **Account memory tools may be absent or disabled** — never rely on them. Everything durable lives here: `docs/STATUS.md` (state) · `docs/AGENTS.md` (rules) · ADRs (why) · RDs (what done means) · `docs/CHANGELOG.md` (history).
- **Agent sandboxes gate the GitHub API** (REST + GraphQL). Never depend on `gh api`. Git itself is open: verify PRs with `git ls-remote origin 'refs/pull/*/head'`, main with `refs/heads/main`.
- **Pushing a work branch opens its PR** (`auto-pr`); merging a PR that touches `docs/STATUS.md` updates the repo About (`about-sync`). The operator merges — never you.
- **Credentials** come from the operator's hand-off `.env` (on their machine, read over the file bridge) — never chat, never a commit, never a doc (ADR-0019/0020/0021).
- **The operator's folder `aos-exploration/` mirrors `docs/`** — after merging docs changes, sync changed files there over the file bridge if connected; the repo stays canonical.
