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
    // Quota exceeded or storage revoked mid-session: keep the value for this visit.
    if (raw === null) memory.delete(key);
    else memory.set(key, raw);
  }
  listeners.forEach((fn) => fn());
}

/** Parse a raw stored string; anything missing or malformed becomes the empty value. */
export function parseStored<K extends StoreKey>(key: K, raw: string | null): StoreValue<K> {
  if (raw === null) return STORE[key].empty;
  try {
    const parsed = STORE[key].schema.safeParse(JSON.parse(raw));
    return parsed.success ? (parsed.data as StoreValue<K>) : STORE[key].empty;
  } catch {
    return STORE[key].empty;
  }
}

export function read<K extends StoreKey>(key: K): StoreValue<K> {
  return parseStored(key, readRaw(key));
}

export function write<K extends StoreKey>(key: K, value: StoreValue<K>): void {
  writeRaw(key, JSON.stringify(value));
}

export function update<K extends StoreKey>(key: K, fn: (current: StoreValue<K>) => StoreValue<K>): void {
  write(key, fn(read(key)));
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

export function importAll(text: string): ImportResult {
  const result = validateImport(text);
  if (!result.ok) return result;
  const keys = Object.keys(result.data) as StoreKey[];
  for (const key of keys) write(key, result.data[key] as never);
  return { ok: true, keys };
}
