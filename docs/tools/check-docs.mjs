#!/usr/bin/env node
// بسم الله الرحمن الرحيم
// check-docs — the truth-keeper (ADR-0015). Zero dependencies.
// Run from the docs root:  node tools/check-docs.mjs
// Fails on: missing front-matter · broken relative links · ADR-index drift ·
//           unmanifested renders · a render older than any of its sources.
// Warns on: docs untouched for 180+ days (stale-by-default honesty).

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve, relative } from 'path';

const ROOT = resolve(process.argv[2] ?? '.');
const DOC_DIRS = ['00-vision','01-architecture','02-decisions','03-reference','04-practices','05-research','06-requirements'];
const ROOT_DOCS = ['README.md','AGENTS.md','CHANGELOG.md'];
const STALE_DAYS = 180;

let fails = 0, warns = 0;
const fail = (m) => { fails++; console.log('  ✗ FAIL  ' + m); };
const warn = (m) => { warns++; console.log('  ⚠ warn  ' + m); };
const ok   = (m) => { console.log('  ✓ ok    ' + m); };

// ---------- collect docs ----------
const docs = [];
for (const d of DOC_DIRS) {
  const dir = join(ROOT, d);
  if (!existsSync(dir)) { fail(`missing directory ${d}/`); continue; }
  for (const f of readdirSync(dir)) if (f.endsWith('.md')) docs.push(join(dir, f));
}
for (const f of ROOT_DOCS) {
  const p = join(ROOT, f);
  if (existsSync(p)) docs.push(p); else fail(`missing root doc ${f}`);
}

// ---------- front-matter ----------
console.log('\nfront-matter');
const meta = new Map(); // path -> {status, date}
for (const p of docs) {
  const rel = relative(ROOT, p);
  const src = readFileSync(p, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) { fail(`${rel} — no front-matter block`); continue; }
  const fm = Object.fromEntries(
    m[1].split('\n')
      .map(l => l.match(/^([\w-]+):\s*(.*)$/))
      .filter(Boolean)
      .map(x => [x[1], x[2].replace(/^"|"$/g, '')])
  );
  const date = fm.updated ?? fm.date;
  if (!fm.status) fail(`${rel} — front-matter missing status:`);
  if (!date) fail(`${rel} — front-matter missing updated:/date:`);
  meta.set(rel, { status: fm.status, date });
}
ok(`${docs.length} docs scanned`);

// ---------- staleness warning ----------
const today = new Date();
for (const [rel, { status, date }] of meta) {
  if (status !== 'current') continue; // ADRs are immutable; superseded is allowed to age
  const age = (today - new Date(date)) / 86400000;
  if (age > STALE_DAYS) warn(`${rel} — untouched for ${Math.round(age)} days; review or restamp`);
}

// ---------- relative links ----------
console.log('\nrelative links');
let linkCount = 0;
for (const p of docs) {
  const rel = relative(ROOT, p);
  const src = readFileSync(p, 'utf8');
  for (const m of src.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    linkCount++;
    const target = resolve(dirname(p), href.split('#')[0]);
    if (!existsSync(target)) fail(`${rel} → broken link: ${href}`);
  }
  // inline code path references to renders/ and tools/ — resolve doc-relative OR root-relative
  for (const m of src.matchAll(/`((?:\.\.\/)*(?:renders|tools)\/[^`]+)`/g)) {
    const docRel = resolve(dirname(p), m[1]);
    const rootRel = resolve(ROOT, m[1].replace(/^(\.\.\/)+/, ''));
    if (!existsSync(docRel) && !existsSync(rootRel)) fail(`${rel} → referenced path missing: ${m[1]}`);
  }
}
ok(`${linkCount} relative links resolved`);

// ---------- ADR index sync ----------
console.log('\nADR index');
const adrDir = join(ROOT, '02-decisions');
const adrFiles = readdirSync(adrDir).filter(f => /^\d{4}-.*\.md$/.test(f));
const idx = readFileSync(join(adrDir, 'README.md'), 'utf8');
const idxLinks = [...idx.matchAll(/\[\d{4}\]\((\d{4}-[^)]+\.md)\)/g)].map(m => m[1]);
for (const f of adrFiles) if (!idxLinks.includes(f)) fail(`ADR file not in index: ${f}`);
for (const l of idxLinks) if (!adrFiles.includes(l)) fail(`index links missing ADR file: ${l}`);
if (adrFiles.length === idxLinks.length) ok(`${adrFiles.length} ADRs, index in sync`);

// ---------- renders freshness ----------
console.log('\nrenders');
const rDir = join(ROOT, 'renders');
if (!existsSync(rDir)) { fail('renders/ missing'); }
else {
  const htmls = readdirSync(rDir).filter(f => f.endsWith('.html'));
  const manPath = join(rDir, 'MANIFEST.json');
  if (!existsSync(manPath)) { fail('renders/MANIFEST.json missing'); }
  else {
    const man = JSON.parse(readFileSync(manPath, 'utf8'));
    const manned = man.renders.map(r => r.file);
    for (const h of htmls) if (!manned.includes(h)) fail(`render not in MANIFEST: ${h}`);
    for (const r of man.renders) {
      if (!existsSync(join(rDir, r.file))) { fail(`MANIFEST lists missing render: ${r.file}`); continue; }
      let newest = null, newestSrc = null;
      for (const s of r.sources) {
        if (!meta.has(s)) { fail(`${r.file} → source not a known doc: ${s}`); continue; }
        const d = meta.get(s).date;
        if (!newest || d > newest) { newest = d; newestSrc = s; }
      }
      if (newest && newest > r.rendered_at)
        fail(`STALE render: ${r.file} (rendered ${r.rendered_at}) older than ${newestSrc} (${newest}) — regenerate + restamp`);
      else ok(`${r.file} fresh (rendered ${r.rendered_at}, ${r.sources.length} sources)`);
    }
  }
}

// ---------- summary ----------
console.log(`\n${fails === 0 ? '✓ all checks passed' : `✗ ${fails} failure(s)`} · ${warns} warning(s)`);
process.exit(fails === 0 ? 0 : 1);
