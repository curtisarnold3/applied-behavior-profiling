// Usage: node scripts/print-cards.mjs <baseUrl> <outDir>
// Saves the field cards as PDFs (pocket and letter layouts) so the print preview can be checked.
import { chromium } from "@playwright/test";
const [base, out] = process.argv.slice(2);
const b = await chromium.launch();
const page = await b.newPage();
await page.goto(base + "/field-cards", { waitUntil: "load" });
for (const layout of ["pocket", "letter"]) {
  await page.getByTestId(`layout-${layout}`).check();
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: `${out}/field-cards-${layout}.pdf`, preferCSSPageSize: true, printBackground: true });
  await page.emulateMedia({ media: "screen" });
}
await b.close();
