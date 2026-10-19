import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/*
 * Regenerates src/data/accommodations.source.ts from the authoritative CSV.
 *
 * The CSV (MOUJA_accommodation_complet.csv) stays local and is intentionally
 * NOT published to the repository. This script inlines its contents into a
 * committed TypeScript module so the site builds and deploys without the CSV.
 *
 * Run with: npm run data:accommodations
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = resolve(root, 'MOUJA_accommodation_complet.csv');
const outPath = resolve(root, 'src/data/accommodations.source.ts');

const csv = readFileSync(csvPath, 'utf8');

const banner = [
  '/* AUTO-GENERATED — do not edit by hand.',
  ' * Inlined snapshot of the authoritative accommodation CSV.',
  ' * The CSV itself is kept local and is not published to the repository.',
  ' * Regenerate with: npm run data:accommodations',
  ' */',
  '',
].join('\n');

const out = `${banner}export const csvRaw = ${JSON.stringify(csv)};\n\nexport default csvRaw;\n`;

writeFileSync(outPath, out, 'utf8');
console.log(`Generated ${outPath} (${csv.length} chars)`);
