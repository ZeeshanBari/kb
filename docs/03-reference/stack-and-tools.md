---
title: Stack & named tools
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# The stack, and every named tool

## Core stack

| Layer | Choice |
|---|---|
| Runtime | Node 22 · TypeScript end-to-end |
| HTTP / UI | Fastify · React + Vite SPA · Caddy (auto-TLS, serves static) |
| Data | Postgres 17 · pgvector (halfvec) · tsvector FTS · pg-boss · schema-as-code DDL |
| Models | Claude via one gateway — Haiku (triage) · Sonnet (extraction, answers) · pinned embeddings |
| Surfaces | Web (Google OIDC, domain allowlist) · Slack Bolt (socket mode) |
| Edge | Node agent on launchd · SQLite outbox · mlx-whisper · Docling · Tailscale |
| Ops | systemd · pgBackRest → R2 · healthchecks.io · Sentry |
| Tests | Vitest · real-Postgres CI container · recorded cassettes · golden-50 · promptfoo |

## Named tool per hard problem

| Problem | Use | Instead of | Because |
|---|---|---|---|
| Deterministic text pass | wink-nlp + custom regex | spaCy sidecar | TS-native, µs, free on 100% |
| PDF parsing | pdfjs-dist; Docling on the mini for scanned | Unstructured / LlamaParse | digital PDFs are text; OCR stays local & free |
| Office files | Google-native export; exceljs + mammoth for uploads | generic converters | exports are canonical |
| Audio | mlx-whisper on mini; OpenAI/Groq Whisper fallback | cloud-only | free locally; meetings don't wait |
| Identity matching | deterministic IDs → talisman metaphone + Jaro-Winkler → review queue | Splink / Zingg | ER platforms are for tens of millions of records |
| Hybrid retrieval | FTS + pgvector fused with RRF, in SQL | day-one reranker | deterministic & free; add voyage-rerank only if golden-50 demands |
| Global questions | graphology Louvain + Sonnet community summaries | GraphRAG pipeline | ADR-0007 |
| Answer loop | Anthropic SDK tool-use, hand-rolled + citation validator | LangGraph / Vercel AI SDK | budget & citations must be ours |
| Evals | golden-50 as Vitest cases; promptfoo for prompt regression | Braintrust / LangSmith | exact assertions; nothing ships to SaaS |
| Connectors | first-party SDKs (Bolt, googleapis); cursors ours | Nango / Composio | never outsource the cursor |
| Jobs | pg-boss | Temporal / Inngest / BullMQ | a queue table suffices |
| Auth | openid-client, Google OIDC | Slack OAuth · magic links | Workspace accounts exist |
| TLS | Caddy | nginx + certbot | auto-renew, 4 lines |
| Backups | pgBackRest → R2 | wal-g · pg_dump | PITR + verification |
| Secrets | SOPS + age in repo (ADR-0019) — `.env` only as generated output; CI holds one `AGE_KEY` | Vault · plain .env · Doppler | no service; auditable; one secret-zero |
| Kanban | adapter — Trello REST / Linear GraphQL | own board | cards from cited answers, not a new board |
| Repo | one monorepo (app · worker · ui · edge · infra) | polyrepo | one PR = schema + connector + test |

**Version policy:** model names, embedding model, and extractor versions are *config with consequences* — any change to extractor or embedding versions re-runs the eval gate before production.
