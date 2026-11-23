import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportAll, importAll, migrate, NAMESPACE, read, resetAll, resetStorageState, storageAvailable, update, validateImport, write } from "@/lib/storage";
import type { LogEntry } from "@/lib/schema";

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
    ["bad level", JSON.stringify({ app: "abp", version: 1, exportedAt: "x", data: { assessment: { traits: { confidence: 9 }, habits: {}, date: "" } } })],
  ])("rejects a malformed file (%s) and changes nothing", (_name, text) => {
    write("log", [entry]);
    const result = importAll(text);
    expect(result.ok).toBe(false);
    expect(read("log")).toEqual([entry]);
  });
});
