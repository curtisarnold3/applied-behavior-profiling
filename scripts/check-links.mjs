#!/usr/bin/env node
/**
 * Internal link checker. Crawls the built site starting at "/", follows every
 * same-site link, and fails if any page or #anchor is missing.
 *
 *   npm run build && node scripts/check-links.mjs            (starts its own server)
 *   node scripts/check-links.mjs https://example.vercel.app  (checks a live site)
 */
import { spawn } from "node:child_process";

const external = process.argv[2];
const PORT = 3199;
const base = external ?? `http://localhost:${PORT}`;
let server;

if (!external) {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

const seen = new Map(); // path -> { ok, ids:Set, links:[] }
const queue = ["/"];
const broken = [];

async function load(path) {
  const res = await fetch(base + path, { redirect: "manual" });
  const html = res.ok ? await res.text() : "";
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const links = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  return { status: res.status, ok: res.ok, ids, links };
}

try {
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    const page = await load(path);
    seen.set(path, page);
    if (!page.ok) continue;
    for (const href of page.links) {
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const url = new URL(href, base + path);
      const target = url.pathname;
      if (/\.(png|ico|svg|xml|txt|webmanifest|json|csv)$/.test(target)) continue;
      if (!seen.has(target) && !queue.includes(target)) queue.push(target);
    }
  }
  for (const [path, page] of seen) {
    if (!page.ok) continue;
    for (const href of page.links) {
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const url = new URL(href, base + path);
      const target = seen.get(url.pathname);
      if (/\.(png|ico|svg|xml|txt|webmanifest|json|csv)$/.test(url.pathname)) continue;
      if (!target || !target.ok) broken.push(`${path} -> ${href} (page ${target?.status ?? "not found"})`);
      else if (url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1))))
        broken.push(`${path} -> ${href} (no element with that id)`);
    }
  }
} finally {
  if (server) {
    try {
      process.kill(-server.pid);
    } catch {
      /* already gone */
    }
  }
}

const pages = [...seen.values()].filter((p) => p.ok).length;
const unique = [...new Set(broken)];
unique.forEach((b) => console.log("BROKEN", b));
console.log(`\nCrawled ${pages} pages. ${unique.length} broken internal link(s).`);
process.exit(unique.length ? 1 : 0);
