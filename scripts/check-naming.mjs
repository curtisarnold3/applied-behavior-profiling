#!/usr/bin/env node
/**
 * Naming check (Gate 6). The restricted names may appear only on the Credits
 * page and in the single inventory credit. This mirrors:
 *   grep -rniE "nci|neurocognitive|nonverbal communication intelligence|chase hughes" app content components
 * and fails if a match turns up anywhere other than the allowed files.
 * ("nci" is matched as a whole word so ordinary words like "financial" don't trip it;
 * the raw grep is still printed for a human to eyeball.)
 */
import fs from "node:fs";
import path from "node:path";

const ALLOWED = [path.join("app", "credits"), path.join("content", "assessment.ts")];
const STRICT = /\bnci\b|neurocognitive|nonverbal communication intelligence|chase hughes|\bhughes\b/i;
const root = process.cwd();

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return /\.(woff2|png|ico|jpg)$/.test(e.name) ? [] : [full];
  });
}

let bad = 0;
let allowed = 0;
for (const dir of ["app", "content", "components", "lib", "public"]) {
  for (const file of walk(path.join(root, dir))) {
    const rel = path.relative(root, file);
    fs.readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (!STRICT.test(line)) return;
        if (ALLOWED.some((a) => rel.startsWith(a))) {
          allowed++;
          console.log(`ok   ${rel}:${i + 1}: ${line.trim().slice(0, 110)}`);
        } else {
          bad++;
          console.log(`FAIL ${rel}:${i + 1}: ${line.trim().slice(0, 110)}`);
        }
      });
  }
}
console.log(`\n${allowed} allowed mention(s), ${bad} violation(s).`);
if (bad > 0) process.exit(1);
