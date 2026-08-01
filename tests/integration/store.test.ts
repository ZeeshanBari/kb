// بسم الله الرحمن الرحيم
// Against REAL Postgres — zero DB mocks (testing-and-observability.md).
// Set PG_URL to run; skipped otherwise (CI provides a service container).
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createStore, type Store } from '../../platform/src/store.ts';
import { publish, readSince, ack } from '../../platform/src/events.ts';
import { cursorAgeCheck } from '../../platform/src/health.ts';
import { ingestOnce, type Connector } from '../../worker/src/connector.ts';

const PG_URL = process.env.PG_URL;

describe.skipIf(!PG_URL)('store against real Postgres', () => {
  let store: Store;

  beforeAll(async () => {
    store = createStore(PG_URL!);
    await store.pool.query('DROP TABLE IF EXISTS raw_item, event, ingest_cursor, consumer_watermark CASCADE');
    await store.applySchema();
  });
  afterAll(async () => { await store.close(); });

  it('schema application is idempotent — apply twice, no error, no drift', async () => {
    await store.applySchema();
    const tables = await store.pool.query(
      `SELECT count(*)::int AS n FROM information_schema.tables
       WHERE table_name IN ('raw_item','event','ingest_cursor','consumer_watermark')`);
    expect(tables.rows[0].n).toBe(4);
  });

  it('idempotency keys: the same event published twice lands once', async () => {
    const a = await publish(store.pool, { kind: 't.k', actor: 'test', idemKey: 'once' });
    const b = await publish(store.pool, { kind: 't.k', actor: 'test', idemKey: 'once' });
    expect(a).toBeGreaterThan(0);
    expect(b).toBeNull();
  });

  it('watermark consumption: read → ack → read returns nothing twice', async () => {
    await publish(store.pool, { kind: 'w.k', actor: 'test', idemKey: 'w1' });
    const first = await readSince(store.pool, 'test-consumer', 100);
    expect(first.length).toBeGreaterThan(0);
    await ack(store.pool, 'test-consumer', first.at(-1)!.id);
    const second = await readSince(store.pool, 'test-consumer', 100);
    expect(second).toHaveLength(0);
  });

  it('THE PHASE-1 EXIT TEST: replaying a connector changes nothing', async () => {
    let pulls = 0;
    const fake: Connector = {
      source: 'faketest',
      async pull() {
        pulls++;
        return {
          items: [
            { extId: 'm1', payload: { text: 'hello' } },
            { extId: 'm2', payload: { text: 'world' }, label: 'open' as const },
          ],
          nextCursor: `pull-${pulls}`,
        };
      },
    };
    const run1 = await ingestOnce(store, fake);
    expect(run1).toMatchObject({ pulled: 2, inserted: 2 });

    const run2 = await ingestOnce(store, fake);            // the replay
    expect(run2).toMatchObject({ pulled: 2, inserted: 0 }); // nothing duplicates

    const rows = await store.pool.query(`SELECT count(*)::int AS n FROM raw_item WHERE source = 'faketest'`);
    expect(rows.rows[0].n).toBe(2);
    const events = await store.pool.query(`SELECT count(*)::int AS n FROM event WHERE kind = 'raw.ingested' AND actor = 'connector:faketest'`);
    expect(events.rows[0].n).toBe(2);                       // events didn't duplicate either
    const cur = await store.pool.query(`SELECT position FROM ingest_cursor WHERE source = 'faketest'`);
    expect(cur.rows[0].position).toBe('pull-2');            // cursor still advances
  });

  it('cursor health: fresh=ok · missing=unverifiable · stalled=fail', async () => {
    const fresh = await cursorAgeCheck(store.pool, 'faketest', 60_000)();
    expect(fresh.verdict).toBe('ok');

    const missing = await cursorAgeCheck(store.pool, 'never-ran', 60_000)();
    expect(missing.verdict).toBe('unverifiable');           // no green tick nobody earned

    await store.pool.query(`UPDATE ingest_cursor SET advanced_at = now() - interval '1 hour' WHERE source = 'faketest'`);
    const stalled = await cursorAgeCheck(store.pool, 'faketest', 60_000)();
    expect(stalled.verdict).toBe('fail');
    expect(stalled.detail).toContain('stalled');
  });
});
