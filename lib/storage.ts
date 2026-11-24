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
  for (const key of STORE_KEYS) writeRaw(key, null);
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

/** Merge two lists by id: imported entries are added, and replace any existing entry with the same id. */
function mergeById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const byId = new Map(current.map((e) => [e.id, e] as const));
  for (const e of incoming) byId.set(e.id, e);
  return [...byId.values()];
}

/**
 * Import a backup. Lists (practice log, milestones, beliefs) are merged into what's
 * already here, so importing a partial export never deletes entries. Everything else
 * (progress, scores, assessment, capstone) is replaced by the file's version.
 */
export function importAll(text: string): ImportResult {
  const result = validateImport(text);
  if (!result.ok) return result;
  const keys = Object.keys(result.data) as StoreKey[];
  for (const key of keys) {
    const incoming = result.data[key];
    if ("item" in STORE[key] && Array.isArray(incoming)) {
      write(key, mergeById(read(key) as { id: string }[], incoming as { id: string }[]) as never);
    } else if (key === "progress") {
      const now = read("progress");
      const file = incoming as StoreValue<"progress">;
      write("progress", { lessons: { ...now.lessons, ...file.lessons }, deliverables: { ...now.deliverables, ...file.deliverables } });
    } else write(key, incoming as never);
  }
  return { ok: true, keys };
}
