import { expect, test } from "@playwright/test";

/** Press Tab until the element matching `selector` has focus. Fails if it's never reached. */
async function tabTo(page: import("@playwright/test").Page, selector: string, max = 80) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
  }
  throw new Error(`Never reached ${selector} with the Tab key`);
}

test("a lesson can be read and completed with the keyboard alone", async ({ page }) => {
  await page.goto("/lesson/needs-map");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);

  // The focus ring is visible on whatever we land on.
  await tabTo(page, "main a");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe("none");

  await tabTo(page, '[data-testid="complete"]');
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("lesson-status")).toHaveText(/Lesson complete/);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/lesson\/significance$/);
});

test("a quiz can be taken with the keyboard alone", async ({ page }) => {
  await page.goto("/unit/human-needs");
  await tabTo(page, '[data-testid="quiz"] button', 120);
  await page.keyboard.press("Enter");
  // Focus moves to the question so a screen-reader user hears it.
  await expect(page.getByTestId("quiz-prompt")).toBeFocused();
  for (let q = 0; q < 3; q++) {
    await tabTo(page, '[data-testid="opt-0"]');
    await page.keyboard.press("Space");
    await expect(page.getByTestId("quiz-feedback")).toBeFocused();
    await tabTo(page, '[data-testid="quiz-next"]');
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("quiz-prompt")).toContainText(/.+/);
  }
  await expect(page.getByTestId("quiz")).toContainText("Question 4 of");
});

test("the practice log can be filled in and saved with the keyboard alone", async ({ page }) => {
  await page.goto("/practice/log?week=3");
  await tabTo(page, '[data-testid="f-context"]');
  await page.keyboard.type("Team meeting");
  await page.keyboard.press("Tab");
  await page.keyboard.type("We've always done it this way");
  await tabTo(page, '[data-testid="f-pillar"]');
  await page.keyboard.press("c"); // type-ahead in the native select: Conformity
  await tabTo(page, '[data-testid="add-entry"]');
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("entries")).toContainText("We've always done it this way");
  await expect(page.getByTestId("entries")).toContainText("Pillar: Conformity");
  await expect(page.getByTestId("status").first()).toContainText("Entry added");
});
