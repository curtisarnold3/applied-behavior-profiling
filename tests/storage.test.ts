import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportAll, importAll, migrate, NAMESPACE, read, resetAll, resetStorageState, storageAvailable, update, validateImport, write } from "@/lib/storage";
import type { LogEntry } from "@/lib/schema";
import { parseWeek } from "@/lib/options";

const entry: LogEntry = {
  id: "a1", date: "2026-11-23", week: 3, track: "live", context: "Coffee with a coworker",
  phrase: "I hope that's okay", need: "approval", pillar: "", value: "", response: "Told her it was handled well",
  reaction: "Relaxed", notes: "",
};

beforeEach(() => {
  window.localStorage.clear();
  resetStorageState();
  vi.restoreAllMocks();
});

describe("read and write", () => {
  it("returns the empty value when nothing is stored", () => {
    expect(read("log")).toEqual([]);
    expect(read("progress")).toEqual({ lessons: {}, deliverables: {} });
  });

  it("round-trips a value under the versioned namespace", () => {
    write("log", [entry]);
    expect(window.localStorage.getItem(`${NAMESPACE}log`)).toContain("I hope that's okay");
    expect(read("log")).toEqual([entry]);
  });

  it("update applies a function to the current value", () => {
    update("progress", (p) => ({ ...p, lessons: { ...p.lessons, significance: "2026-11-23" } }));
    expect(read("progress").lessons.significance).toBe("2026-11-23");
  });

  it("treats corrupted or wrong-shaped data as empty instead of crashing", () => {
    window.localStorage.setItem(`${NAMESPACE}log`, "{not json");
    expect(read("log")).toEqual([]);
    window.localStorage.setItem(`${NAMESPACE}log`, JSON.stringify([{ id: 1 }]));
    expect(read("log")).toEqual([]);
  });
});

describe("one bad entry never costs the rest (review findings 1-3)", () => {
  it("trims over-long text instead of rejecting the whole log", () => {
    const long = { ...entry, id: "long", context: "c".repeat(401), notes: "n".repeat(4001) };
    expect(write("log", [entry, long])).toBe(true);
    const log = read("log");
    expect(log).toHaveLength(2);
    expect(log[1]!.context).toHaveLength(400);
    expect(log[1]!.notes).toHaveLength(4000);
  });

  it("keeps the good entries when one stored entry is invalid", () => {
    const bad = [entry, { ...entry, id: "b", date: "26600-01-01" }, { ...entry, id: "c", week: 3.5 }, { ...entry, id: "d" }];
    window.localStorage.setItem(`${NAMESPACE}log`, JSON.stringify(bad));
    expect(read("log").map((e) => e.id)).toEqual(["a1", "d"]);
    window.localStorage.setItem(`${NAMESPACE}plan`, JSON.stringify([{ id: "1", focus: "Time", step: "s", due: "20277-12-01", done: false }, { id: "2", focus: "Time", step: "s", due: "2027-12-01", done: false }]));
    expect(read("plan").map((m) => m.id)).toEqual(["2"]);
  });

  it("refuses to save an invalid value and leaves what's stored untouched", () => {
    write("log", [entry]);
    expect(write("log", [entry, { ...entry, id: "x", week: 3.5 }])).toBe(false);
    expect(update("log", (l) => [...l, { ...entry, id: "y", date: "26600-01-01" }])).toBe(false);
    expect(read("log")).toEqual([entry]);
  });

  it("keeps the whole capstone when one field is over-long", () => {
    const cap = read("capstone");
    cap.profiles[0]!.sentence = "If I...";
    cap.profiles[2]!.who = "w".repeat(401);
    expect(write("capstone", cap)).toBe(true);
    expect(read("capstone").profiles[0]!.sentence).toBe("If I...");
    expect(read("capstone").profiles[2]!.who).toHaveLength(400);
  });

  it("only accepts whole weeks 1-8 from the address bar", () => {
    expect(["3", "8", " 5 "].map(parseWeek)).toEqual([3, 8, 5]);
    expect(["3.5", "0", "9", "99", "-1", "abc", "0x5", "", "<script>", null].map(parseWeek)).toEqual(Array(10).fill(null));
  });
});

describe("when a write fails mid-visit (review finding 5)", () => {
  it("switches to memory, keeps existing data visible, and reports storage as unavailable", () => {
    write("log", [entry]);
    expect(storageAvailable()).toBe(true);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const second = { ...entry, id: "a2", phrase: "Second" };
    expect(write("log", [entry, second])).toBe(true);
    expect(read("log")).toEqual([entry, second]);
    expect(storageAvailable()).toBe(false);
    expect(read("progress")).toEqual({ lessons: {}, deliverables: {} });
  });
});

describe("when storage is blocked", () => {
  it("falls back to memory and never throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(storageAvailable()).toBe(false);
    expect(() => write("log", [entry])).not.toThrow();
    expect(read("log")).toEqual([entry]);
    expect(() => resetAll()).not.toThrow();
    expect(read("log")).toEqual([]);
  });
});

describe("export, import, migrate", () => {
  it("exports every key with a version", () => {
    write("log", [entry]);
    const file = exportAll(new Date("2026-11-23T10:00:00Z"));
    expect(file.app).toBe("abp");
    expect(file.version).toBe(1);
    expect(file.data.log).toEqual([entry]);
    expect(Object.keys(file.data).sort()).toEqual(
      ["assessment", "beliefs", "capstone", "log", "plan", "progress", "quiz"].sort(),
    );
  });

  it("restores data after a reset", () => {
    write("log", [entry]);
    const text = JSON.stringify(exportAll());
    resetAll();
    expect(read("log")).toEqual([]);
    expect(importAll(text).ok).toBe(true);
    expect(read("log")).toEqual([entry]);
  });

  it("merges an imported log into the existing one instead of replacing it (review finding 4)", () => {
    const others = [{ ...entry, id: "w4", week: 4 }, { ...entry, id: "w5", week: 5 }];
    write("log", [entry, ...others]);
    const partial = JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { log: [{ ...entry, notes: "edited" }] } });
    expect(importAll(partial).ok).toBe(true);
    const log = read("log");
    expect(log.map((e) => e.id).sort()).toEqual(["a1", "w4", "w5"]);
    expect(log.find((e) => e.id === "a1")!.notes).toBe("edited");
  });

  it("merges imported progress and never un-completes a lesson", () => {
    write("progress", { lessons: { a: "x" }, deliverables: { "w1:journal": true } });
    importAll(JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { progress: { lessons: { b: "y" }, deliverables: {} } } }));
    expect(read("progress")).toEqual({ lessons: { a: "x", b: "y" }, deliverables: { "w1:journal": true } });
  });

  it("migrates a version-0 file by filling in week and track", () => {
    const { week: _w, track: _t, ...old } = entry;
    void _w; void _t;
    const migrated = migrate({ app: "abp", version: 0, exportedAt: "x", data: { log: [old] } });
    expect(migrated.version).toBe(1);
    const result = validateImport(JSON.stringify({ app: "abp", version: 0, exportedAt: "x", data: { log: [old] } }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.log?.[0]).toMatchObject({ week: 3, track: "controlled", phrase: entry.phrase });
  });

  it.each([
    ["not JSON", "hello"],
    ["wrong app", JSON.stringify({ app: "other", version: 1, exportedAt: "x", data: {} })],
    ["missing envelope", JSON.stringify({ log: [] })],
    ["newer version", JSON.stringify({ app: "abp", version: 99, exportedAt: "x", data: {} })],
    ["unknown key", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { evil: 1 } })],
    ["bad entry", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { log: [{ ...entry, need: "money" }] } })],
    ["bad date", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { log: [{ ...entry, date: "yesterday" }] } })],
    ["score above total", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { quiz: { "unit-1": { best: 1e999, last: 1, total: 20, date: "" } } } })],
    ["score above total (finite)", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { quiz: { "unit-1": { best: 21, last: 1, total: 20, date: "" } } } })],
    ["bad level", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { assessment: { traits: { confidence: 9 }, habits: {}, date: "" } } })],
  ])("rejects a malformed file (%s) and changes nothing", (_name, text) => {
    write("log", [entry]);
    const result = importAll(text);
    expect(result.ok).toBe(false);
    expect(read("log")).toEqual([entry]);
  });
});
