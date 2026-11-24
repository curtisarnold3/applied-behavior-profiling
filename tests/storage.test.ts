import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportAll, importAll, migrate, planImport, NAMESPACE, read, resetAll, resetStorageState, storageAvailable, update, validateImport, write } from "@/lib/storage";
import { STORE, type LogEntry } from "@/lib/schema";
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

describe("reset after a failed write (review finding N3)", () => {
  it("erases the copy on disk as well as the one in memory", () => {
    write("log", [entry]);
    const real = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    write("log", [entry, { ...entry, id: "a2" }]);
    expect(storageAvailable()).toBe(false);
    resetAll();
    expect(read("log")).toEqual([]);
    Storage.prototype.setItem = real;
    expect(window.localStorage.getItem(`${NAMESPACE}log`)).toBeNull();
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

  it("adds missing log entries on import and never changes or removes existing ones (review findings 4 and N1)", () => {
    const others = [{ ...entry, id: "w4", week: 4 }, { ...entry, id: "w5", week: 5 }];
    write("log", [{ ...entry, notes: "my newer note" }, ...others]);
    const file = JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { log: [{ ...entry, notes: "older" }, { ...entry, id: "new" }, { ...entry, id: "new" }] } });
    expect(importAll(file).ok).toBe(true);
    const log = read("log");
    expect(log.map((e) => e.id).sort()).toEqual(["a1", "new", "w4", "w5"]);
    expect(log.find((e) => e.id === "a1")!.notes).toBe("my newer note");
  });

  it("an older full backup cannot overwrite newer capstone, ratings, scores or progress (review finding N1)", () => {
    const older = JSON.stringify(exportAll());
    const cap = read("capstone");
    cap.profiles[0]!.sentence = "If I stay strong...";
    write("capstone", cap);
    write("assessment", { traits: { confidence: 4 }, habits: { time: 2 }, date: "now" });
    write("quiz", { "unit-1": { best: 19, last: 19, total: 20, date: "now" } });
    write("progress", { lessons: { significance: "now" }, deliverables: { "w3:log": true } });
    write("beliefs", [{ id: "b1", belief: "x", domain: "Self", source: "", exception: "NEW careful answer", helping: "", inCharge: "", coach: "", opposite: "" }]);

    const plan = planImport(older, "merge");
    expect(plan.ok).toBe(true);
    expect(importAll(older).ok).toBe(true);
    expect(read("capstone").profiles[0]!.sentence).toBe("If I stay strong...");
    expect(read("assessment").traits.confidence).toBe(4);
    expect(read("quiz")["unit-1"]!.best).toBe(19);
    expect(read("progress").lessons.significance).toBe("now");
    expect(read("progress").deliverables["w3:log"]).toBe(true);
    expect(read("beliefs")[0]!.exception).toBe("NEW careful answer");
  });

  it("merge fills gaps: empty capstone profiles, missing ratings, better scores", () => {
    write("quiz", { "unit-1": { best: 10, last: 10, total: 20, date: "a" } });
    write("assessment", { traits: { confidence: 4 }, habits: {}, date: "a" });
    const cap = STORE.capstone.empty;
    const filled = { ...cap.profiles[1]!, who: "Sam", sentence: "If I..." };
    const file = JSON.stringify({
      app: "abp", version: 1, exportedAt: "x",
      data: {
        quiz: { "unit-1": { best: 15, last: 3, total: 20, date: "b" }, "unit-2": { best: 9, last: 9, total: 18, date: "b" } },
        assessment: { traits: { confidence: 1, discipline: 3 }, habits: { time: 2 }, date: "b" },
        capstone: { profiles: [cap.profiles[0], filled, cap.profiles[2]] },
      },
    });
    const plan = planImport(file, "merge");
    expect(plan.ok && plan.lines.map((l) => l.key)).toEqual(["quiz", "assessment", "capstone"]);
    importAll(file);
    expect(read("quiz")["unit-1"]).toMatchObject({ best: 15, last: 10 });
    expect(read("quiz")["unit-2"]!.best).toBe(9);
    expect(read("assessment")).toMatchObject({ traits: { confidence: 4, discipline: 3 }, habits: { time: 2 } });
    expect(read("capstone").profiles[1]!.who).toBe("Sam");
  });

  it("replace mode swaps in the file's version, but only when asked for", () => {
    write("quiz", { "unit-1": { best: 19, last: 19, total: 20, date: "now" } });
    write("log", [entry, { ...entry, id: "extra" }]);
    const file = JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { quiz: {}, log: [entry] } });
    expect(importAll(file, "replace").ok).toBe(true);
    expect(read("quiz")).toEqual({});
    expect(read("log")).toEqual([entry]);
  });

  it("reports failure and writes nothing when the merged result would be too large (review finding N2)", () => {
    write("log", [entry]);
    const huge = Array.from({ length: 5000 }, (_, i) => ({ ...entry, id: `h${i}` }));
    const result = importAll(JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { log: huge, quiz: { "unit-1": { best: 1, last: 1, total: 20, date: "" } } } }));
    expect(result.ok).toBe(false);
    expect(read("log")).toEqual([entry]);
    expect(read("quiz")).toEqual({});
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
