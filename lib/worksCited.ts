import fs from "node:fs";
import path from "node:path";

/**
 * The Credits page reproduces the Works Cited section of docs/syllabus.md.
 * Reading it from the file at build time keeps the two from ever drifting apart.
 */
export function getWorksCited(): { intro: string; entries: string[] } {
  const md = fs.readFileSync(path.join(process.cwd(), "docs", "syllabus.md"), "utf8");
  const start = md.indexOf("## Works cited");
  if (start === -1) throw new Error("docs/syllabus.md has no '## Works cited' section.");
  const paragraphs = md
    .slice(start)
    .split(/\n{2,}/)
    .slice(1)
    .map((p) => p.trim())
    .filter(Boolean);
  const [intro, ...entries] = paragraphs;
  if (!intro || entries.length === 0) throw new Error("Works cited section is empty.");
  return { intro, entries };
}

export type Inline = { kind: "text" | "em" | "url"; text: string };

/** Minimal inline markdown: *italics* and bare URLs. */
export function parseInline(md: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*([^*]+)\*|(https?:\/\/[^\s]+?)(?=[.,;]?(\s|$))/g;
  let last = 0;
  for (const m of md.matchAll(re)) {
    if (m.index > last) out.push({ kind: "text", text: md.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: "em", text: m[1] });
    else out.push({ kind: "url", text: m[2]! });
    last = m.index + m[0].length;
  }
  if (last < md.length) out.push({ kind: "text", text: md.slice(last) });
  return out;
}
