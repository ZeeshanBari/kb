// بسم الله الرحمن الرحيم
// FileDrop: the zero-credential connector (credentials-manifest.md degradation
// ladder — "the system boots useful with nothing"). Drop .json/.md/.txt files
// in a folder; they become raw items. Also the reference implementation every
// real connector (Slack, Drive, Gmail) copies: same contract, different API.

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import type { Connector, PullResult, RawInput } from '../connector.ts';

const EXTS = new Set(['.json', '.md', '.txt']);

export function fileDropConnector(dir: string): Connector {
  return {
    source: 'filedrop',
    async pull(cursor: string | null): Promise<PullResult> {
      // Cursor = the newest (mtimeMs:name) already ingested; lexicographic-safe.
      const since = cursor ? Number(cursor.split(':')[0]) : 0;
      const items: RawInput[] = [];
      let newest = since;

      const files = readdirSync(dir)
        .filter((f) => EXTS.has(extname(f)))
        .map((f) => ({ f, mtime: statSync(join(dir, f)).mtimeMs }))
        .sort((a, b) => a.mtime - b.mtime);

      for (const { f, mtime } of files) {
        if (mtime <= since) continue;
        const text = readFileSync(join(dir, f), 'utf8');
        items.push({
          extId: f,
          payload: { filename: f, mtimeMs: mtime, text },
        });
        newest = Math.max(newest, mtime);
      }
      return { items, nextCursor: `${newest}:tail` };
    },
  };
}
