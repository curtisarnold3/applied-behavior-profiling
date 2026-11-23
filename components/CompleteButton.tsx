"use client";

import Link from "next/link";
import { useStored } from "@/lib/useStored";
import { StorageNotice } from "./StorageNotice";

export function CompleteButton({ slug, next }: { slug: string; next?: { href: string; label: string } }) {
  const [progress, setProgress, ready] = useStored("progress");
  const done = ready && Boolean(progress.lessons[slug]);

  const toggle = () =>
    setProgress((p) => {
      const lessons = { ...p.lessons };
      if (lessons[slug]) delete lessons[slug];
      else lessons[slug] = new Date().toISOString();
      return { ...p, lessons };
    });

  return (
    <div className="no-print sheet mt-10 p-4">
      <StorageNotice />
      <p className="stamp" aria-live="polite" data-testid="lesson-status">
        {done ? "✓ Lesson complete" : "Finished reading?"}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={toggle} aria-pressed={done} className={`btn ${done ? "" : "btn-primary"}`} data-testid="complete">
          {done ? "Mark as not done" : "Mark lesson complete"}
        </button>
        {next ? (
          <Link href={next.href} className={`btn ${done ? "btn-primary" : ""}`}>
            Next: {next.label} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function DoneTick({ slug }: { slug: string }) {
  const [progress, , ready] = useStored("progress");
  const done = ready && Boolean(progress.lessons[slug]);
  return (
    <span className={`stamp shrink-0 ${done ? "text-olive" : ""}`} data-testid={`tick-${slug}`}>
      {done ? "✓ Done" : "To do"}
    </span>
  );
}
