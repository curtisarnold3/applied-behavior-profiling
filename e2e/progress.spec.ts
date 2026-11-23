import { expect, test } from "@playwright/test";

test("complete a lesson, reload, still complete, home shows the right resume point", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("resume")).toHaveText(/Start Week 1/);

  // Complete the first lesson of the course.
  await page.getByTestId("resume").click();
  await page.waitForURL(/\/lesson\//);
  const firstUrl = page.url();
  await expect(page.getByTestId("lesson-status")).toHaveText(/Finished reading/);
  await page.getByTestId("complete").click();
  await expect(page.getByTestId("lesson-status")).toHaveText(/Lesson complete/);

  await page.reload();
  await expect(page.getByTestId("lesson-status")).toHaveText(/Lesson complete/);
  await expect(page.getByTestId("complete")).toHaveAttribute("aria-pressed", "true");

  // Home now points at the second lesson, not the first.
  await page.goto("/");
  const resume = page.getByTestId("resume");
  await expect(resume).toHaveText(/Resume Week \d, Lesson \d\.\d+/);
  const href = await resume.getAttribute("href");
  expect(href).toBeTruthy();
  expect(firstUrl.endsWith(href!)).toBe(false);

  // Un-completing puts the resume point back.
  await page.goto(firstUrl);
  await page.getByTestId("complete").click();
  await page.goto("/");
  await expect(page.getByTestId("resume")).toHaveText(/Start Week 1/);
});

test("a completed lesson shows as done on its unit and week pages", async ({ page }) => {
  await page.goto("/lesson/significance");
  await page.getByTestId("complete").click();
  await page.goto("/unit/human-needs");
  await expect(page.getByTestId("tick-significance")).toHaveText(/Done/);
  await expect(page.getByTestId("tick-acceptance")).toHaveText(/To do/);
  await page.goto("/week/3");
  await expect(page.getByTestId("tick-significance")).toHaveText(/Done/);
});

test("weekly deliverables can be checked off and survive a reload", async ({ page }) => {
  await page.goto("/week/3");
  const box = page.getByRole("checkbox", { name: /Needs log/ });
  await box.check();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /Needs log/ })).toBeChecked();
});
