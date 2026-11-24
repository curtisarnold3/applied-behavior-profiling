import type { LogEntry } from "./schema";

export const LOG_COLUMNS = [
  "date", "week", "track", "context", "phrase", "need", "pillar", "value", "response", "reaction", "notes",
] as const satisfies readonly (keyof LogEntry)[];

const HEADERS: Record<(typeof LOG_COLUMNS)[number], string> = {
  date: "Date", week: "Week", track: "Track", context: "Context", phrase: "Exact phrase heard",
  need: "Need", pillar: "Pillar", value: "Value", response: "My response", reaction: "Their reaction", notes: "Notes",
};

/** Quote a cell per RFC 4180, and defuse spreadsheet formulas (=, +, -, @ at the start). */
export function csvCell(value: string | number): string {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function logToCsv(entries: LogEntry[]): string {
  const rows = [LOG_COLUMNS.map((c) => csvCell(HEADERS[c])).join(",")];
  for (const e of entries) rows.push(LOG_COLUMNS.map((c) => csvCell(e[c])).join(","));
  // The leading BOM tells Excel the file is UTF-8, so curly quotes and accents survive.
  return "\uFEFF" + rows.join("\r\n") + "\r\n";
}
