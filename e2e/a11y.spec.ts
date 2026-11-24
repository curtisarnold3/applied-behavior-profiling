import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Every route on the site, read from the sitemap so new pages are covered automatically. */
async function allRoutes(request: import("@playwright/test").APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  expect(routes.length).toBeGreaterThan(60);
  return [...routes, "/this-page-does-not-exist"];
}

test("axe finds no serious or critical violations on any route", async ({ page, request }) => {
  test.setTimeout(300_000);
  const problems: string[] = [];
  for (const route of await allRoutes(request)) {
    await page.goto(route);
    await page.locator("h1").first().waitFor();
    const results = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    for (const v of results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"))
      problems.push(`${route}: [${v.impact}] ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target.join(" ")}`);
  }
  expect(problems).toEqual([]);
});

test("axe is clean on interactive states: open quiz, flipped card, filled tools", async ({ page }) => {
  const check = async (label: string) => {
    const results = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${label}: ${v.id} ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
  };
  await page.goto("/unit/human-needs");
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByTestId("opt-1").click();
  await check("quiz feedback");

  await page.goto("/practice");
  await page.getByTestId("deck-needs").click();
  await page.getByTestId("flip").click();
  await check("flashcard");

  await page.goto("/tools/self-assessment");
  await page.getByTestId("trait-confidence-2").check();
  await page.getByTestId("habit-time-1").check();
  await check("assessment results");

  await page.goto("/progress");
  await page.getByTestId("reset").click();
  await check("reset dialog");

  await page.goto("/tools/limiting-beliefs");
  await page.getByTestId("belief-text").fill("I can't");
  await page.getByTestId("belief-add").click();
  await check("belief card");
});

test("usable at 360px wide with no horizontal scroll, on every route", async ({ page, request }) => {
  test.setTimeout(300_000);
  await page.setViewportSize({ width: 360, height: 740 });
  const wide: string[] = [];
  for (const route of await allRoutes(request)) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) wide.push(`${route}: ${overflow}px`);
  }
  expect(wide).toEqual([]);
});

test("touch targets are at least 24px (WCAG 2.2 target size)", async ({ page }) => {
  for (const route of ["/", "/lesson/significance", "/practice/log", "/progress", "/week/3"]) {
    await page.goto(route);
    const small = await page.locator("a:visible, button:visible, input:visible, select:visible, summary:visible").evaluateAll((els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width <= 1 || r.height <= 1) return false; // hidden, or screen-reader-only until focused
          // Links inside a sentence are exempt (inline exception).
          const inline = el.tagName === "A" && getComputedStyle(el).display === "inline";
          return !inline && (r.width < 24 || r.height < 24);
        })
        .map((el) => `${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}"`),
    );
    expect(small, route).toEqual([]);
  }
});

test("the content-security policy blocks nothing the site itself needs", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text().slice(0, 160));
  });
  await page.addInitScript(() => document.addEventListener("securitypolicyviolation", (e) => console.error(`Refused to load ${e.violatedDirective} ${e.blockedURI}`)));
  for (const route of ["/", "/lesson/significance", "/unit/human-needs", "/practice", "/practice/log", "/tools/profile-builder", "/tools/self-assessment", "/capstone", "/progress", "/field-cards", "/syllabus"]) {
    await page.goto(route);
    await page.locator("h1").first().waitFor();
  }
  expect(violations).toEqual([]);
});
