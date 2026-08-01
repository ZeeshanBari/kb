---
title: Mission & principles
status: current
updated: 2026-08-01
owner: zeeshan
---

> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ

# Mission

Build a **company-wide knowledge base** that ingests every channel (Slack, WhatsApp, iMessage, email) and the shared drive (docs, sheets, meeting audio), and answers complex, multi-document questions **with proof** — then acts on the answers (e.g., creating kanban cards), safely.

The test question: *"Why did company sales drop in March?"* The honest answer separates one **fact** (the number, from versioned SQL), several **hypotheses** (evidence-linked events from that window), and a refusal to assert causation it cannot support. That answer is more useful than a confident guess — and it is testable.

## The six features

| # | Feature | Contract |
|---|---|---|
| 1 | **Ingest** | Replay changes nothing; a stalled cursor raises an alarm |
| 2 | **Resolve** | One record per real person; ambiguity returns nothing rather than guessing |
| 3 | **Relate** | No claim exists without an evidence span you can open |
| 4 | **Measure** | Same question → same number, forever — or the definition version changed |
| 5 | **Answer** | Every sentence maps to evidence IDs, or it is not said |
| 6 | **Act** | Every action traces to the answer that motivated it; shadow before live |

## Principles — the rules that never bend

1. **One way to do each thing.** One store, one event log, one model gateway, one ingest pipeline. Two ways is a bug.
2. **A feature isn't shipped until something proves it ran.** Health checks assert *effects*, not imports. Shadow mode first for anything that acts.
3. **Every check can say "could not verify."** A monitor that reports OK when it saw nothing hides every bug it exists to catch.
4. **The absence of data is the failure mode.** Cursor stalls alarm; silence is never treated as health.
5. **Evidence is mandatory.** A claim without a source span cannot be inserted.
6. **Numbers never come from a model.** Metrics are human-written, versioned SQL. The model picks *which* metric, never *what it equals*.
7. **Raw is sacred; derived is disposable.** Everything above the raw layer can be deleted and rebuilt.
8. **Labels from day one, failing closed.** Access control is retrofit-proof only if it's born in the schema.
9. **A boundary earns a network wire only when a different machine needs it.** Otherwise it's a module boundary.
10. **Delete first.** If two things do the same job, one dies today.
11. **Restore before features.** A backup that has never been restored does not exist.
12. **Provenance on every mutation** — every row names the event that caused it.
13. **Begin with the basmallah.** بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
