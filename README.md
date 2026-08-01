# بسم الله الرحمن الرحيم

# kb — the company knowledge graph

> **Status:** Stage 0 — the repo gate · ~95% done · shipped: replay-safe ingest platform · self-checking docs · CI merge gate · auto-PR workshop — live detail in [`docs/STATUS.md`](docs/STATUS.md)

A company-wide knowledge base built from channel messages and a shared drive, answering multi-hop questions like *"why did sales drop in March?"* — with proof. The product monorepo (ADR-0014): code and docs travel together.

**[📓 Change log](docs/CHANGELOG.md) · [🧭 Status / the baton](docs/STATUS.md) · [📚 All docs](docs/README.md) · [🗺 Execution plan](docs/03-reference/execution-plan.md) · [🤖 Agent rules](docs/AGENTS.md)**

Agents: your entry point is [`CLAUDE.md`](CLAUDE.md). The five-gate stage lifecycle and PR conduct are law here: **no RD, no branch; never merge red.**

## Layout

- `platform/` — store (schema-as-code, labels fail closed) · event log (idempotent publish, watermark consume) · tri-state health
- `worker/` — the connector contract (cursor · deterministic id · replay-safe-by-construction) + `filedrop`, the zero-credential reference connector
- `tests/unit` — pure logic, milliseconds, no network
- `tests/integration` — against REAL Postgres, zero DB mocks
- `docs/` — the only source of truth; `node docs/tools/check-docs.mjs docs` must stay green
- `.github/workflows/` — the merge gate (`ci`: test · docs · gitleaks) + `auto-pr` (pushing a work branch opens its PR)

## Run it

```bash
npm ci
npm run test:unit                                        # no dependencies
PG_URL=postgres://postgres:kb@127.0.0.1:5432/kbtest npm test   # full suite vs real Postgres
```

## Stage 0 exit tests (RD-0)

- [x] Replaying a connector changes nothing — rows, events, all deduped; cursor still advances
- [x] Schema application is idempotent — two boots, no drift
- [x] A stalled cursor fails health; a never-run source is *unverifiable*, never a silent pass
- [x] Docs transplanted; checker green in CI
- Next (stage 1, RD pending): the walking skeleton on the real box
