import { expect, test } from "@playwright/test";

/** Count pages and read page sizes straight from the PDF bytes. */
function inspect(pdf: Buffer) {
  const text = pdf.toString("latin1");
  const pages = (text.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
  const boxes = [...text.matchAll(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/g)].map((m) => [Number(m[3]), Number(m[4])]);
  return { pages, boxes };
}

test("field cards fit half-letter with no clipping", async ({ page }) => {
  await page.goto("/field-cards");
  await page.emulateMedia({ media: "print" });
  const cards = page.getByTestId("field-card");
  await expect(cards).toHaveCount(4);

  for (const layout of ["pocket", "letter"] as const) {
    await page.emulateMedia({ media: "screen" });
    await page.getByTestId(`layout-${layout}`).check();
    await page.emulateMedia({ media: "print" });
    const sizes = await cards.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height, overflowY: el.scrollHeight - el.clientHeight, overflowX: el.scrollWidth - el.clientWidth };
      }),
    );
    for (const s of sizes) {
      expect(Math.round(s.w)).toBe(528); // 5.5in at 96dpi
      expect(Math.round(s.h)).toBe(816); // 8.5in
      expect(s.overflowY, `${layout}: content taller than the card`).toBeLessThanOrEqual(0);
      expect(s.overflowX, `${layout}: content wider than the card`).toBeLessThanOrEqual(0);
    }
    const pdf = inspect(await page.pdf({ preferCSSPageSize: true, printBackground: true }));
    if (layout === "pocket") {
      expect(pdf.pages).toBe(4);
      for (const [w, h] of pdf.boxes) expect([Math.round(w!), Math.round(h!)]).toEqual([396, 612]); // 5.5 x 8.5 in
    } else {
      expect(pdf.pages).toBe(2);
      for (const [w, h] of pdf.boxes) expect([Math.round(w!), Math.round(h!)]).toEqual([792, 612]); // 11 x 8.5 in
    }
  }
});

test("syllabus and self-assessment print on US Letter without the site chrome", async ({ page }) => {
  for (const path of ["/syllabus", "/tools/self-assessment", "/capstone"]) {
    await page.goto(path);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header.no-print")).toBeHidden();
    await expect(page.locator("footer.no-print")).toBeHidden();
    const pdf = inspect(await page.pdf({ preferCSSPageSize: true }));
    expect(pdf.pages).toBeGreaterThan(0);
    for (const [w, h] of pdf.boxes) expect([Math.round(w!), Math.round(h!)]).toEqual([612, 792]);
    await page.emulateMedia({ media: "screen" });
  }
});
