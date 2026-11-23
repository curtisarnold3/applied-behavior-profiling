#!/usr/bin/env node
/**
 * Plagiarism check (Gate 6): compares every content file against every file in
 * source/ (plus docs/lesson-briefs.md) and reports any run of N or more
 * identical words, after normalizing case and punctuation.
 *
 *   node scripts/check-plagiarism.mjs            # 15-word runs, all site text
 *   node scripts/check-plagiarism.mjs --n 6 --only content/assessment.ts --against hughes
 *
 * PDFs are read with `pdftotext` (poppler). source/ is gitignored, so on a
 * machine without it (CI, Vercel) the script says so and exits 0.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const N = Number(flag("n", 15));
const only = flag("only", null);
const against = flag("against", null);
const root = process.cwd();

function walk(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full, exts);
    return exts.includes(path.extname(entry.name).toLowerCase()) ? [full] : [];
  });
}

const words = (text) =>
  text
    .toLowerCase()
    .replace(/[‘’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);

function readSource(file) {
  if (file.endsWith(".pdf")) {
    try {
      return execFileSync("pdftotext", [file, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    } catch {
      console.error(`! Could not read ${path.relative(root, file)} (is pdftotext installed?)`);
      process.exitCode = 2;
      return "";
    }
  }
  return fs.readFileSync(file, "utf8");
}

let sources = [
  ...walk(path.join(root, "source"), [".pdf", ".txt", ".md", ".vtt", ".srt"]),
  path.join(root, "docs", "lesson-briefs.md"),
].filter((f) => fs.existsSync(f) && !f.endsWith(path.join("transcripts", "README.md")));
if (against) sources = sources.filter((f) => f.includes(against));

if (!fs.existsSync(path.join(root, "source"))) {
  console.log("source/ is not present on this machine; nothing to compare against. Skipping.");
  process.exit(0);
}

const index = new Map();
for (const file of sources) {
  const w = words(readSource(file));
  for (let i = 0; i + N <= w.length; i++) {
    const key = w.slice(i, i + N).join(" ");
    if (!index.has(key)) index.set(key, path.relative(root, file));
  }
}

const targets = only
  ? [path.join(root, only)]
  : [
      ...walk(path.join(root, "content"), [".mdx", ".md", ".ts", ".tsx"]),
      ...walk(path.join(root, "app"), [".tsx", ".ts", ".mdx"]),
      ...walk(path.join(root, "components"), [".tsx", ".ts"]),
    ];

let hits = 0;
for (const file of targets) {
  const w = words(fs.readFileSync(file, "utf8"));
  let skipUntil = -1;
  for (let i = 0; i + N <= w.length; i++) {
    if (i < skipUntil) continue;
    const key = w.slice(i, i + N).join(" ");
    const from = index.get(key);
    if (from) {
      hits++;
      skipUntil = i + N;
      console.log(`HIT  ${path.relative(root, file)}  <=  ${from}\n     "${key}"`);
    }
  }
}

console.log(
  `\nCompared ${targets.length} site file(s) against ${sources.length} source file(s) for runs of ${N}+ identical words: ${hits} hit(s).`,
);
if (hits > 0) process.exit(1);
