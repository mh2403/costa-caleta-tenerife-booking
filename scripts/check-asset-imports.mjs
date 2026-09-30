import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Git's spelling is authoritative on CI; macOS may resolve incorrect casing.
const trackedPaths = new Set(
  execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean),
);
const errors = [];
let checked = 0;

for (const file of trackedPaths) {
  if (!file.startsWith('src/') || !/\.(?:[cm]?[jt]sx?|css)$/.test(file)) continue;
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/["'`](@\/assets\/[^"'`?#]+)(?:[?#][^"'`]*)?["'`]/g)) {
    const assetPath = match[1].replace(/^@\//, 'src/');
    checked += 1;
    if (!trackedPaths.has(assetPath)) {
      const actual = [...trackedPaths].find((entry) => entry.toLowerCase() === assetPath.toLowerCase());
      errors.push(`${file}: ${assetPath}${actual ? ` — use ${actual}` : ' — missing from Git'}`);
    }
  }
}

if (errors.length) {
  console.error(`Invalid asset imports:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${checked} asset imports against Git filenames (case-sensitive).`);
}
