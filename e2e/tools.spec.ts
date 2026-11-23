import fs from "node:fs";
import { expect, test } from "@playwright/test";

async function addEntry(page: import("@playwright/test").Page, phrase: string) {
  await page.getByTestId("f-context").fill("Coffee, with a coworker");
  await page.getByTestId("f-phrase").fill(phrase);
  await page.getByTestId("f-need").selectOption("approval");
  await page.getByTestId("f-track").selectOption("live");
  await page.getByTestId("f-response").fill('Told her "you handled that well"');
  await page.getByTestId("add-entry").click();
  await expect(page.getByTestId("entries")).toContainText(phrase);
}

test("log an entry, export CSV, and the file contains the entry", async ({ page }) => {
  await page.goto("/practice/log?week=4");
  await addEntry(page, "I hope that's okay, I was just trying to help");
  await expect(page.getByTestId("week-count")).toContainText("Week 4: 1 of 10");

  const download = page.waitForEvent("download");
  await page.getByTestId("export-csv").click();
  const file = await (await download).path();
  const csv = fs.readFileSync(file, "utf8");
  expect(csv.split("\r\n")[0]).toContain("Exact phrase heard");
  expect(csv).toContain('"I hope that\'s okay, I was just trying to help"');
  expect(csv).toContain("approval");
  expect(csv).toContain('"Told her ""you handled that well"""');

  await page.reload();
  await expect(page.getByTestId("entries")).toContainText("I hope that's okay");
});

test("export JSON, reset, import, and the data is restored", async ({ page }) => {
  await page.goto("/lesson/significance");
  await page.getByTestId("complete").click();
  await page.goto("/practice/log?week=3");
  await addEntry(page, "I was the first in my family to do it");

  await page.goto("/progress");
  await expect(page.getByTestId("overall")).toContainText("1 of 37");
  const download = page.waitForEvent("download");
  await page.getByTestId("export-all").click();
  const file = await (await download).path();
  const backup = JSON.parse(fs.readFileSync(file, "utf8"));
  expect(backup.app).toBe("abp");
  expect(backup.data.log[0].phrase).toBe("I was the first in my family to do it");

  await page.getByTestId("reset").click();
  await page.getByTestId("reset-cancel").click();
  await expect(page.getByTestId("overall")).toContainText("1 of 37");
  await page.getByTestId("reset").click();
  await page.getByTestId("reset-confirm").click();
  await expect(page.getByTestId("overall")).toContainText("0 of 37");
  await page.goto("/practice/log?week=3");
  await expect(page.getByTestId("entries")).toHaveCount(0);

  await page.goto("/progress");
  await page.getByTestId("import-file").setInputFiles(file);
  await expect(page.getByTestId("status")).toContainText("Imported");
  await expect(page.getByTestId("overall")).toContainText("1 of 37");
  await page.goto("/practice/log?week=3");
  await expect(page.getByTestId("entries")).toContainText("I was the first in my family to do it");
});

test("a malformed import is rejected and changes nothing", async ({ page }, info) => {
  await page.goto("/practice/log?week=3");
  await addEntry(page, "Keep me");
  await page.goto("/progress");
  const bad = info.outputPath("bad.json");
  fs.writeFileSync(bad, JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { log: [{ nope: true }] } }));
  await page.getByTestId("import-file").setInputFiles(bad);
  await expect(page.getByTestId("status")).toContainText("Import failed");
  await page.goto("/practice/log?week=3");
  await expect(page.getByTestId("entries")).toContainText("Keep me");
});

test("profile builder assembles the sentence and saves to the log", async ({ page }) => {
  await page.goto("/tools/profile-builder");
  await page.getByTestId("pb-quote").fill("I'm always the one people lean on");
  await page.getByTestId("pillar-necessity").check();
  await page.getByTestId("need-significance").check();
  await page.getByTestId("value-connection").check();
  await expect(page.getByTestId("pb-sentence")).toHaveText("If I handle what has to be done, then people will see that I matter, so I can finally feel connected.");
  await page.getByTestId("pb-save").click();
  await expect(page.getByTestId("status")).toContainText("alternative read");
  await page.getByTestId("pb-alt").fill("Considered approval; no checking for a verdict.");
  await page.getByTestId("pb-save").click();
  await expect(page.getByTestId("status")).toContainText("Saved");
  await page.goto("/practice/log?week=7");
  await expect(page.getByTestId("entries")).toContainText("Ruled out: Considered approval");
  await expect(page.getByTestId("entries")).toContainText("Pillar: Necessity");
});

test("self-assessment highlights the lowest trait and area and keeps a dated plan", async ({ page }) => {
  await page.goto("/tools/self-assessment");
  await expect(page.getByTestId("inventory-credit")).toContainText("Authority Behavior Inventory");
  const picks: Record<string, number> = { "trait-confidence": 3, "trait-discipline": 1, "trait-leadership": 4, "trait-gratitude": 3, "trait-enjoyment": 5, "habit-environment": 3, "habit-time": 2, "habit-appearance": 4, "habit-social": 3, "habit-financial": 4 };
  for (const [k, v] of Object.entries(picks)) await page.getByTestId(`${k}-${v}`).check();
  await expect(page.getByTestId("rated-count")).toHaveText("10 of 10 rated");
  await expect(page.getByTestId("low-discipline")).toContainText("Your goal is level 2");
  await expect(page.getByTestId("low-time")).toContainText("Your goal is level 3");
  await page.getByTestId("plan-step").fill("Plan tomorrow before bed, every night");
  await page.getByTestId("plan-due").fill("2026-12-15");
  await page.getByTestId("plan-add").click();
  await page.reload();
  await expect(page.getByTestId("plan-list")).toContainText("Plan tomorrow before bed");
  await expect(page.getByTestId("plan-list")).toContainText("2026-12-15");
  await expect(page.getByTestId("low-discipline")).toBeVisible();
});

test("limiting-beliefs worksheet records the tests and the opposite belief", async ({ page }) => {
  await page.goto("/tools/limiting-beliefs");
  await page.getByTestId("belief-text").fill("I'm just not a confident person");
  await page.getByTestId("belief-add").click();
  await page.getByTestId("belief-0-exception").fill("I ran the school fundraiser");
  await page.getByTestId("belief-0-opposite").fill("I can build confidence one conversation at a time");
  await page.reload();
  await expect(page.getByTestId("belief-list")).toContainText("I'm just not a confident person");
  await expect(page.getByTestId("belief-0-opposite")).toHaveValue("I can build confidence one conversation at a time");
});

test("capstone template has three profiles, shows the pass criteria, and exports", async ({ page }) => {
  await page.goto("/capstone");
  await expect(page.getByTestId("pass-criteria")).toContainText("evidence phrases actually support the read");
  for (const i of [0, 1, 2]) await expect(page.getByTestId(`capstone-${i}`)).toBeVisible();
  await page.getByTestId("cap-0-who").fill("Podcast guest");
  await page.getByTestId("cap-0-need").selectOption("intelligence");
  const download = page.waitForEvent("download");
  await page.getByTestId("capstone-export").click();
  const data = JSON.parse(fs.readFileSync(await (await download).path(), "utf8"));
  expect(data.data.capstone.profiles).toHaveLength(3);
  expect(data.data.capstone.profiles[0].need).toBe("intelligence");
});

test.describe("with storage blocked", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Access is denied for this document.", "SecurityError");
        },
      });
    });
  });

  test("tools show a clear notice and nothing crashes", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of ["/", "/lesson/significance", "/week/3", "/unit/human-needs", "/practice", "/practice/log", "/tools/profile-builder", "/tools/self-assessment", "/tools/limiting-beliefs", "/capstone", "/progress", "/field-cards"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
    }
    for (const path of ["/practice/log", "/tools/profile-builder", "/tools/self-assessment", "/tools/limiting-beliefs", "/capstone", "/progress", "/lesson/significance"]) {
      await page.goto(path);
      await expect(page.getByTestId("storage-notice").first()).toContainText("Progress won’t be saved");
    }
    // Still usable for the visit: an entry can be added and exported.
    await page.goto("/practice/log");
    await addEntry(page, "Works without storage");
    const download = page.waitForEvent("download");
    await page.getByTestId("export-csv").click();
    expect(fs.readFileSync(await (await download).path(), "utf8")).toContain("Works without storage");
    await page.goto("/lesson/significance");
    await page.getByTestId("complete").click();
    await expect(page.getByTestId("lesson-status")).toHaveText(/Lesson complete/);
    expect(errors).toEqual([]);
  });
});
