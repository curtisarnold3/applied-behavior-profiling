"use client";

import { useStorageAvailable } from "@/lib/useStored";

/** Shown only when the browser blocks storage. Tools keep working for the visit. */
export function StorageNotice() {
  const available = useStorageAvailable();
  if (available !== false) return null;
  return (
    <p role="status" data-testid="storage-notice" className="mb-3 border-[1.5px] border-accent-deep bg-card p-3 text-base">
      <strong>Progress won&rsquo;t be saved.</strong> This browser is blocking storage for this site (private mode
      or a privacy setting). Everything still works, but what you enter is kept only until you close the page.
    </p>
  );
}
