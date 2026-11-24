import { CURRENT_VERSION, STORE, STORE_KEYS, exportSchema, type ExportFile, type StoreKey, type StoreValue } from "./schema";

/**
 * All learner data lives in localStorage under one versioned namespace.
 * Every call is wrapped in try/catch: if storage is blocked, we fall back to
 * an in-memory map so the page keeps working for the current visit.
 */
export const NAMESPACE = "abp:v1:";

type Backend = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const memory = new Map<string, string>();
const listeners = new Set<() => void>();
let available: boolean | null = null;
/** Set when a write fails mid-visit (quota full, storage revoked). From then on we work from memory. */
let degraded = false;

function backend(): Backend | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** True when localStorage can actually be written to. Cached after first check. */
export function storageAvailable(): boolean {
  if (degraded) return false;
  if (available !== null) return available;
  try {
    const b = backend();
    if (!b) return (available = false);
    const probe = `${NAMESPACE}__probe`;
    b.setItem(probe, "1");
    b.removeItem(probe);
    return (available = true);
  } catch {
    return (available = false);
  }
}

/** Test helper: forget the cached availability and in-memory fallback. */
export function resetStorageState(): void {
  available = null;
  degraded = false;
  memory.clear();
}

export function readRaw(key: StoreKey): string | null {
  try {
    if (storageAvailable()) return backend()!.getItem(NAMESPACE + key);
  } catch {
    /* fall through to memory */
  }
  return memory.get(key) ?? null;
}

function writeRaw(key: StoreKey, raw: string | null): void {
  try {
    if (storageAvailable()) {
      if (raw === null) backend()!.removeItem(NAMESPACE + key);
      else backend()!.setItem(NAMESPACE + key, raw);
    } else if (raw === null) memory.delete(key);
    else memory.set(key, raw);
  } catch {
    // Quota exceeded or storage revoked mid-session. Copy what we can into memory and
    // work from there for the rest of the visit, so nothing the learner sees goes missing
    // and the "won't be saved" notice appears.
    for (const k of STORE_KEYS) {
      if (memory.has(k)) continue;
      try {
        const existing = backend()?.getItem(NAMESPACE + k);
        if (existing != null) memory.set(k, existing);
      } catch {
        /* unreadable; leave it empty */
      }
    }
    degraded = true;
    if (raw === null) memory.delete(key);
    else memory.set(key, raw);
  }
  listeners.forEach((fn) => fn());
}

/**
 * Parse a raw stored string. Missing data becomes the empty value. If a list has
 * one bad entry, only that entry is dropped; the rest of the list is kept.
 */
export function parseStored<K extends StoreKey>(key: K, raw: string | null): StoreValue<K> {
  if (raw === null) return STORE[key].empty;
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return STORE[key].empty;
  }
  return salvage(key, json) ?? STORE[key].empty;
}

/** Validate a value for a key, keeping the good entries of a list when some are bad. null if nothing is usable. */
export function salvage<K extends StoreKey>(key: K, json: unknown): StoreValue<K> | null {
  const def = STORE[key];
  const parsed = def.schema.safeParse(json);
  if (parsed.success) return parsed.data as StoreValue<K>;
  if ("item" in def && Array.isArray(json)) {
    const kept = json.flatMap((entry) => {
      const one = def.item.safeParse(entry);
      return one.success ? [one.data] : [];
    });
    return kept as StoreValue<K>;
  }
  return null;
}

export function read<K extends StoreKey>(key: K): StoreValue<K> {
  return parseStored(key, readRaw(key));
}

/**
 * Save a value. It is validated (and over-long text trimmed) first; a value that
 * can't be made valid is refused and what's already stored is left untouched.
 */
export function write<K extends StoreKey>(key: K, value: StoreValue<K>): boolean {
  const parsed = STORE[key].schema.safeParse(value);
  if (!parsed.success) return false;
  writeRaw(key, JSON.stringify(parsed.data));
  return true;
}

export function update<K extends StoreKey>(key: K, fn: (current: StoreValue<K>) => StoreValue<K>): boolean {
  return write(key, fn(read(key)));
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key.startsWith(NAMESPACE)) fn();
  };
  try {
    window.addEventListener("storage", onStorage);
  } catch {
    /* no window */
  }
  return () => {
    listeners.delete(fn);
    try {
      window.removeEventListener("storage", onStorage);
    } catch {
      /* no window */
    }
  };
}

export function resetAll(): void {
  for (const key of STORE_KEYS) {
    // Clear the disk copy directly too, so a reset still erases it when we're running from memory.
    try {
      backend()?.removeItem(NAMESPACE + key);
    } catch {
      /* storage unavailable; the memory copy below is all there is */
    }
    memory.delete(key);
  }
  listeners.forEach((fn) => fn());
}

export function exportAll(now: Date = new Date()): ExportFile {
  const data: Record<string, unknown> = {};
  for (const key of STORE_KEYS) data[key] = read(key);
  return { app: "abp", version: CURRENT_VERSION, exportedAt: now.toISOString(), data };
}

/**
 * Upgrade an export file from an older version to the current shape.
 * Version 0 (pre-release) stored log entries without `week` or `track`.
 */
export function migrate(file: ExportFile): ExportFile {
  let { version } = file;
  const data = { ...file.data };
  if (version === 0) {
    if (Array.isArray(data.log)) {
      data.log = data.log.map((entry: unknown) =>
        entry && typeof entry === "object"
          ? { week: 3, track: "controlled", ...(entry as Record<string, unknown>) }
          : entry,
      );
    }
    version = 1;
  }
  return { ...file, version, data };
}

export type ImportResult = { ok: true; keys: StoreKey[] } | { ok: false; error: string };

/** Validate an export file completely before writing anything. Malformed files change nothing. */
export function validateImport(text: string): { ok: true; data: Partial<{ [K in StoreKey]: StoreValue<K> }> } | { ok: false; error: string } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }
  const envelope = exportSchema.safeParse(json);
  if (!envelope.success) return { ok: false, error: "That doesn't look like an export from this site." };
  if (envelope.data.version > CURRENT_VERSION)
    return { ok: false, error: "That export comes from a newer version of this site." };
  const file = migrate(envelope.data);
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(file.data)) {
    if (!(key in STORE)) return { ok: false, error: `Unknown section "${key.slice(0, 40)}" in the file.` };
    const parsed = STORE[key as StoreKey].schema.safeParse(file.data[key]);
    if (!parsed.success) return { ok: false, error: `The "${key}" section of the file is malformed.` };
    out[key] = parsed.data;
  }
  return { ok: true, data: out };
}

export type ImportMode = "merge" | "replace";
export type ImportLine = { key: StoreKey; label: string; note: string };
export type ImportPlan = { ok: true; mode: ImportMode; lines: ImportLine[]; values: Partial<{ [K in StoreKey]: StoreValue<K> }> } | { ok: false; error: string };

const LABELS: Record<StoreKey, string> = {
  progress: "Lesson progress", log: "Practice log", quiz: "Unit check scores", assessment: "Self-assessment",
  plan: "Milestone plan", beliefs: "Limiting beliefs", capstone: "Capstone",
};
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const isBlank = (o: object) => Object.values(o).every((v) => v === "" || v === false);

/**
 * Work out exactly what an import would do, without doing it.
 *
 * "merge" (the default) only ever ADDS: it never changes or removes anything
 * already here. "replace" swaps each section in the file for the file's version.
 */
export function planImport(text: string, mode: ImportMode): ImportPlan {
  const result = validateImport(text);
  if (!result.ok) return result;
  const lines: ImportLine[] = [];
  const values: Record<string, unknown> = {};

  for (const key of Object.keys(result.data) as StoreKey[]) {
    const label = LABELS[key];
    const file = result.data[key];
    if (mode === "replace") {
      values[key] = file;
      lines.push({ key, label, note: "replaced with the file's version" });
      continue;
    }
    if (key === "log" || key === "plan" || key === "beliefs") {
      const now = read(key) as { id: string }[];
      const have = new Set(now.map((e) => e.id));
      const unique = (file as { id: string }[]).filter((e, i, all) => all.findIndex((x) => x.id === e.id) === i);
      const fresh = unique.filter((e) => !have.has(e.id));
      const kept = unique.length - fresh.length;
      values[key] = [...now, ...fresh];
      lines.push({ key, label, note: `${plural(fresh.length, "entry", "entries")} added${kept ? `, ${kept} already here and left as ${kept === 1 ? "it is" : "they are"}` : ""}` });
    } else if (key === "progress") {
      const now = read("progress");
      const f = file as StoreValue<"progress">;
      const lessons = { ...f.lessons, ...now.lessons };
      // Anything the learner has ticked or un-ticked here wins; the file only fills in check-offs never touched.
      const deliverables = { ...f.deliverables, ...now.deliverables };
      values[key] = { lessons, deliverables };
      const added = Object.keys(lessons).length - Object.keys(now.lessons).length;
      const ticks = Object.keys(deliverables).filter((k) => deliverables[k] && !(k in now.deliverables)).length;
      lines.push({ key, label, note: `${plural(added, "completed lesson")} and ${plural(ticks, "check-off")} added; nothing of yours changed` });
    } else if (key === "quiz") {
      const now = read("quiz");
      const f = file as StoreValue<"quiz">;
      const out = { ...now };
      let raised = 0;
      for (const [unit, score] of Object.entries(f)) {
        const mine = now[unit];
        if (!mine) {
          out[unit] = score;
          raised++;
        } else if (score.total === mine.total && score.best > mine.best) {
          out[unit] = { ...mine, best: score.best };
          raised++;
        }
      }
      values[key] = out;
      lines.push({ key, label, note: raised ? `${plural(raised, "best score")} added or raised; none lowered` : "your scores are already as good or better; unchanged" });
    } else if (key === "assessment") {
      const now = read("assessment");
      const f = file as StoreValue<"assessment">;
      const traits = { ...f.traits, ...now.traits };
      const habits = { ...f.habits, ...now.habits };
      const filled = Object.keys(traits).length + Object.keys(habits).length - Object.keys(now.traits).length - Object.keys(now.habits).length;
      values[key] = { traits, habits, date: now.date || f.date };
      lines.push({ key, label, note: filled ? `${plural(filled, "missing rating")} filled in; your existing ratings kept` : "your ratings kept; unchanged" });
    } else if (key === "capstone") {
      const now = read("capstone");
      const f = file as StoreValue<"capstone">;
      let filled = 0;
      const profiles = now.profiles.map((mine, i) => {
        const theirs = f.profiles[i];
        if (theirs && isBlank(mine) && !isBlank(theirs)) {
          filled++;
          return theirs;
        }
        return mine;
      });
      values[key] = { profiles };
      lines.push({ key, label, note: filled ? `${plural(filled, "empty profile")} filled from the file; profiles you've started were kept` : "your profiles kept; unchanged" });
    }
  }

  // Check every section fits before writing any of them.
  for (const key of Object.keys(values) as StoreKey[]) {
    if (!STORE[key].schema.safeParse(values[key]).success)
      return { ok: false, error: `The combined ${LABELS[key].toLowerCase()} would be too large to store.` };
  }
  return { ok: true, mode, lines, values: values as Partial<{ [K in StoreKey]: StoreValue<K> }> };
}

/** Carry out a plan from `planImport`. All-or-nothing as far as validation goes. */
export function applyImport(plan: Extract<ImportPlan, { ok: true }>): ImportResult {
  const keys = Object.keys(plan.values) as StoreKey[];
  for (const key of keys) {
    if (!write(key, plan.values[key] as never)) return { ok: false, error: `The ${LABELS[key].toLowerCase()} couldn't be saved.` };
  }
  return { ok: true, keys };
}

/** Plan and apply in one step. Defaults to the safe, add-only merge. */
export function importAll(text: string, mode: ImportMode = "merge"): ImportResult {
  const plan = planImport(text, mode);
  return plan.ok ? applyImport(plan) : plan;
}
