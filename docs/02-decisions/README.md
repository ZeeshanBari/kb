---
title: Decisions (ADRs)
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Architecture Decision Records

Every significant choice lives here as a numbered, **immutable** record. To change a decision, write a new ADR that supersedes the old one — never edit history. This is how a future reader (human or agent) learns not just *what* we do but *what we already tried and why we said no*.

| # | Decision | Status |
|---|---|---|
| [0001](0001-modular-monolith.md) | Modular monolith — not lambdas, not microservices | accepted |
| [0002](0002-hosting-hetzner-r2.md) | Hetzner CX42 + Cloudflare R2 | accepted |
| [0003](0003-postgres-for-everything.md) | Postgres does everything | accepted |
| [0004](0004-typescript-no-orm.md) | TypeScript end-to-end, no ORM, schema as code | accepted |
| [0005](0005-web-plus-slack.md) | Web app + Slack bot — not desktop | accepted |
| [0006](0006-observability-not-datadog.md) | Self-observing in SQL + Sentry + dead-man — not Datadog | accepted |
| [0007](0007-graph-engine-not-graphrag.md) | Steal GraphRAG's ideas, not its pipeline | accepted |
| [0008](0008-models-claude-gateway.md) | Claude behind one gateway; local models rejected for extraction | accepted |
| [0009](0009-mini-is-transport-not-pipeline.md) | The Mac mini is transport, not a second pipeline | accepted |
| [0010](0010-ship-as-compose-bundle.md) | Ship as OCI images + a Docker Compose bundle | accepted |
| [0011](0011-secrets-in-db-recovery-key.md) | Secrets envelope-encrypted in Postgres, one recovery key | accepted |
| [0012](0012-converge-installer-not-terraform.md) | A converge CLI installer — not Terraform, not a bash script | accepted |
| [0013](0013-wizard-two-browser-phases.md) | The install wizard is two browser phases — zero native apps | accepted · first under the agree-first rule |
| [0014](0014-monorepo-github.md) | One product monorepo + a tiny deploy repo, on private GitHub | accepted |
| [0015](0015-renders-are-generated.md) | Markdown canonical; HTML renders generated, freshness-checked | accepted |
| [0016](0016-execution-plan.md) | The execution plan — eleven stages, five gates, RDs first | accepted |
| [0017](0017-feature-lifecycle.md) | Feature lifecycle — registry, feature_state flags, one onboarding flow | accepted |
| [0018](0018-agentic-workshop.md) | The agentic workshop — PR structure, approval auto-merge, scoped token | accepted |
| [0019](0019-dev-credentials.md) | Dev credentials — SOPS+age truth, generated .env, one AGE_KEY in CI | accepted |

## Template

```markdown
---
title: "ADR-00XX: <short title>"
status: proposed | accepted | superseded-by-00YY
date: YYYY-MM-DD
---

# ADR-00XX — <title>
## Context     — the situation and the forces at play, in ≤ 5 sentences
## Decision    — what we chose, stated as fact
## Rejected    — each alternative with the one-line reason it lost
## Consequences — what this makes easy, what it makes hard, the exit path
```

Rules: one decision per ADR · rejected alternatives are mandatory · always name the exit path · begin with the basmallah.
