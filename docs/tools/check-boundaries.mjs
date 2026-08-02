#!/usr/bin/env node
// بسم الله الرحمن الرحيم
// check-boundaries — fictional boundaries killed the predecessor (ADR-0022).
// Zero dependencies. Parses every import in every layer; a forbidden edge fails CI.
// Run from the repo root:  node docs/tools/check-boundaries.mjs

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';

const ROOT = resolve(process.argv[2] ?? '.');

// The matrix (boundaries-and-testing.md). Key = layer; value = internal layers it may import.
const ALLOW = {
  platform: [],
  worker: ['platform'],
  app: ['platform'],
  edge: [],
  tools: ['platform'],
  deploy: ['platform'],
};
const LAYERS = Object.keys(ALLOW);

let fails = 0, checked = 0;
const fail = (m) => { fails++; console.log('  ✗ FAIL  ' + m); };

function* tsFiles(dir) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* tsFiles(p);
    else if (/\.(ts|mts|mjs|js)$/.test(e) && !e.endsWith('.d.ts')) yield p;
  }
}

/** Which layer does an absolute path belong to? null = outside all layers (e.g. tests/). */
function layerOf(abs) {
  const rel = relative(ROOT, abs);
  const top = rel.split(/[\\/]/)[0];
  return LAYERS.includes(top) ? top : null;
}

for (const layer of LAYERS) {
  const dir = join(ROOT, layer);
  if (!existsSync(dir)) continue; // app/, edge/, deploy/ arrive in later stages
  for (const file of tsFiles(dir)) {
    const src = readFileSync(file, 'utf8');
    const relFile = relative(ROOT, file);
    for (const m of src.matchAll(/(?:^|\n)\s*(?:import|export)[^'"\n]*from\s*['"]([^'"]+)['"]/g)) {
      const spec = m[1];
      checked++;
      if (!spec.startsWith('.')) continue;            // bare imports (pg, node:*) — package.json's concern
      const target = resolve(dirname(file), spec);
      const targetLayer = layerOf(target);
      if (targetLayer === null) { fail(`${relFile} imports outside all layers: ${spec}`); continue; }
      if (targetLayer !== layer && !ALLOW[layer].includes(targetLayer))
        fail(`${relFile} (${layer}) imports ${targetLayer} — edge not in the matrix: ${spec}`);
    }
  }
}

// tests/ may import anything — but only via the layers' public files, no deep node_modules reaches.
console.log(`\n${fails === 0 ? '✓ boundaries hold' : `✗ ${fails} forbidden edge(s)`} · ${checked} imports checked`);
process.exit(fails === 0 ? 0 : 1);
