# بسم الله الرحمن الرحيم

# kb — the company knowledge graph

A company-wide knowledge base built from channel messages and a shared drive, answering multi-hop questions like *"why did sales drop in March?"* — with proof. The product monorepo (ADR-0014): code and docs travel together.

**Start here → [`docs/`](docs/README.md)** — vision, architecture, every decision (ADR-0001…), the agreed execution plan, and [`docs/AGENTS.md`](docs/AGENTS.md) for the rules any agent must follow. The five-gate stage lifecycle and PR conduct are law here: **no RD, no branch; never merge red.**

## Layout

- `platform/` — store (schema-as-code, labels fail closed) · event log (idempotent publish, watermark consume) · tri-state health
- `worker/` — the connector contract (cursor · deterministic id · replay-safe-by-construction) + `filedrop`, the zero-credential reference connector
- `tests/unit` — pure logic, milliseconds, no network
- `tests/integration` — against REAL Postgres, zero DB mocks
- `docs/` — the only source of truth; `node docs/tools/check-docs.mjs docs` must stay green
- `.github/workflows/ci.yml` — the merge gate: **test · docs · gitleaks**

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
