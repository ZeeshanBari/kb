---
title: "ADR-0006: Self-observing in SQL + Sentry + dead-man — not Datadog"
status: accepted
date: 2026-08-01
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# ADR-0006 — Self-observing in SQL + Sentry + dead-man — not Datadog

## Context
Everything flows through one event log, so health signals are queries. Our failure modes are *domain facts* — stalled cursors, extraction backlogs, spend vs cap, backup age — not host graphs.

## Decision
**SQL views over the event log**, rendered by the in-app status page (every check: ok / fail / **could-not-verify**) + **Sentry free tier** for exception grouping + **healthchecks.io free tier** as the external dead-man. Cost: **CA$0**.

## Rejected
- **Datadog** — ≈ CA$65/mo minimum for one host (Infra US$15 + APM US$31) before logs (US$0.10/GB + US$1.70/M events); small stacks land in the low hundreds USD — 5–10× our entire infra. Deeper: it watches hosts and traces; our domain checks would be hand-written custom metrics in either world. And it ships company message metadata to a third party.
- **New Relic** — same shape.
- **Grafana Cloud free** — a second pane of glass duplicating the status page's SQL.
- **Self-hosted Prometheus + Grafana** — two more services for a dozen gauges.

## Consequences
Easy: zero cost, zero data egress, checks live beside the data. Hard: no fancy dashboards (acceptable). **Exit:** GlitchTip self-hosts if Sentry free is outgrown; Grafana Cloud can read the same SQL views via a Postgres datasource. Neither requires re-instrumenting.
