"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { StoreKey, StoreValue } from "./schema";
import { parseStored, read, readRaw, storageAvailable, subscribe, write } from "./storage";

const noop = () => () => {};

/** Read and write one stored value. Renders the empty value on the server and first paint. */
export function useStored<K extends StoreKey>(
  key: K,
): [StoreValue<K>, (next: StoreValue<K> | ((current: StoreValue<K>) => StoreValue<K>)) => boolean, boolean] {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => null);
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const value = useMemo(() => parseStored(key, raw), [key, raw]);
  const set = useCallback(
    (next: StoreValue<K> | ((current: StoreValue<K>) => StoreValue<K>)) => {
      return write(key, typeof next === "function" ? next(read(key)) : next);
    },
    [key],
  );
  return [value, set, ready];
}

/** null until mounted, then whether storage can be written to. */
export function useStorageAvailable(): boolean | null {
  return useSyncExternalStore(subscribe, () => storageAvailable(), () => null);
}
