// Usage: node scripts/screenshots.mjs <baseUrl> <outDir> <path[@selector]>...
// Takes a phone-width screenshot of each path (viewport only, or one element with @selector)
// and reports any sideways overflow. W=360 sets the width.
import { chromium } from "@playwright/test";
const [base, out, ...targets] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: Number(process.env.W ?? 390), height: 844 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
for (const t of targets) {
  const [p, sel] = t.split("@");
  await page.goto(base + p, { waitUntil: "load" });
  const name = (t.replace(/[^a-z0-9]+/gi, "_") || "home") + ".png";
  if (sel) await page.locator(sel).first().screenshot({ path: `${out}/${name}` });
  else await page.screenshot({ path: `${out}/${name}`, fullPage: process.env.FULL === "1" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(t, "overflow:", overflow);
}
await b.close();
