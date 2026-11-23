import Link from "next/link";
import type { LessonMeta } from "@/lib/content";
import { DoneTick } from "./CompleteButton";

export function LessonList({ lessons }: { lessons: LessonMeta[] }) {
  if (lessons.length === 0) return <p className="hint">Lessons for this part are on their way.</p>;
  return (
    <ol className="space-y-2">
      {lessons.map((l) => (
        <li key={l.slug} className="sheet-soft flex items-center gap-3 px-3 py-2">
          <span aria-hidden="true" className="w-9 shrink-0 font-mono text-sm font-semibold text-accent-deep">
            {l.id}
          </span>
          <span className="min-w-0 flex-1">
            <Link href={`/lesson/${l.slug}`} className="flex min-h-11 items-center font-display text-lg font-bold leading-tight">
              <span className="sr-only">Lesson {l.id}: </span>
              {l.title}
            </Link>
            <span className="hint block pb-1 leading-snug">
              {l.minutes} min · {l.summary}
            </span>
          </span>
          <DoneTick slug={l.slug} />
        </li>
      ))}
    </ol>
  );
}
