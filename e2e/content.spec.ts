import { expect, test } from "@playwright/test";

test("every diagram has an accessible name, description, and text version", async ({ page }) => {
  for (const path of ["/lesson/needs-map", "/lesson/four-needs-circles", "/unit/human-needs"]) {
    await page.goto(path);
    const figures = page.locator("figure[data-diagram]");
    expect(await figures.count(), path).toBeGreaterThan(0);
    for (const figure of await figures.all()) {
      const svg = figure.locator("svg");
      await expect(svg).toHaveAttribute("role", "img");
      expect((await svg.locator("title").textContent())?.length).toBeGreaterThan(5);
      expect((await svg.locator("desc").textContent())?.length).toBeGreaterThan(40);
      await expect(figure.locator("figcaption")).not.toBeEmpty();
      await figure.locator("summary").click();
      expect((await figure.locator("details li").count()) > 0).toBe(true);
    }
  }
});

test("unit landing page carries the ethics line and a unit check", async ({ page }) => {
  await page.goto("/unit/human-needs");
  await expect(page.getByTestId("ethics")).toContainText("never for manipulating");
  await expect(page.getByTestId("quiz")).toBeVisible();
});

test("the unit check gives feedback that explains why, and saves the score", async ({ page }) => {
  await page.goto("/unit/human-needs#check");
  await page.getByRole("button", { name: "Start" }).click();
  let answered = 0;
  while (await page.getByTestId("quiz-prompt").isVisible().catch(() => false)) {
    await page.getByTestId("opt-0").click();
    const feedback = page.getByTestId("quiz-feedback");
    await expect(feedback).toBeVisible();
    expect((await feedback.locator("p").nth(1).textContent())!.length).toBeGreaterThan(60);
    await page.getByTestId("quiz-next").click();
    answered++;
    if (answered > 40) break;
  }
  expect(answered).toBeGreaterThanOrEqual(15);
  await expect(page.getByTestId("quiz-result")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("quiz-best")).toContainText(`of ${answered}`);
});

test("flashcards flip, repeat 'again' cards within the session, and take keyboard shortcuts", async ({ page }) => {
  await page.goto("/practice");
  await page.getByTestId("filter-needs").click();
  await page.getByTestId("deck-needs").click();
  const text = page.getByTestId("card-text");
  const first = await text.textContent();

  await page.getByTestId("flip").click();
  await expect(text).not.toHaveText(first!);
  await page.getByTestId("again").click();

  // The "again" card comes back three cards later.
  for (let i = 0; i < 3; i++) {
    await expect(text).not.toHaveText(first!);
    await page.getByTestId("card").focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("2");
  }
  await expect(text).toHaveText(first!);
});
