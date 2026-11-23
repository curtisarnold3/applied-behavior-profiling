import { describe, expect, it } from "vitest";
import { csvCell, logToCsv } from "@/lib/csv";
import type { LogEntry } from "@/lib/schema";

const base: LogEntry = {
  id: "1", date: "2026-11-23", week: 4, track: "controlled", context: "Podcast", phrase: "Actually, the way it works is...",
  need: "intelligence", pillar: "", value: "", response: "", reaction: "", notes: "",
};

describe("csv export", () => {
  it("writes a header row and one row per entry", () => {
    const lines = logToCsv([base]).trimEnd().split("\r\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("Date,Week,Track,Context,Exact phrase heard,Need,Pillar,Value,My response,Their reaction,Notes");
    expect(lines[1]).toBe('2026-11-23,4,controlled,Podcast,"Actually, the way it works is...",intelligence,,,,,');
  });

  it("escapes quotes, commas, and line breaks", () => {
    expect(csvCell('She said "fine"')).toBe('"She said ""fine"""');
    expect(csvCell("line one\nline two")).toBe('"line one\nline two"');
  });

  it("defuses cells that a spreadsheet would run as a formula", () => {
    expect(csvCell("=SUM(A1:A9)")).toBe("'=SUM(A1:A9)");
    expect(csvCell("-just a dash")).toBe("'-just a dash");
  });

  it("exports an empty log as just the header", () => {
    expect(logToCsv([]).trimEnd().split("\r\n")).toHaveLength(1);
  });
});
