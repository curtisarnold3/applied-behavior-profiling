"use client";

import Link from "next/link";
import { useStored } from "@/lib/useStored";
import { nextLesson, type LessonRef } from "@/lib/progress";

export function ResumeButton({ lessons }: { lessons: LessonRef[] }) {
  const [progress, , ready] = useStored("progress");
  const done = Object.keys(progress.lessons).length;
  const next = nextLesson(lessons, progress);

  if (!ready || done === 0 || lessons.length === 0) {
    const first = lessons[0];
    return (
      <Link href={first ? `/lesson/${first.slug}` : "/syllabus"} className="btn btn-primary" data-testid="resume">
        Start Week 1
      </Link>
    );
  }
  if (!next) {
    return (
      <Link href="/capstone" className="btn btn-primary" data-testid="resume">
        All lessons done: open the capstone
      </Link>
    );
  }
  return (
    <Link href={`/lesson/${next.slug}`} className="btn btn-primary" data-testid="resume">
      Resume Week {next.week}, Lesson {next.id}
      <span className="sr-only">: {next.title}</span>
    </Link>
  );
}

export function LessonTally({ slugs }: { slugs: string[] }) {
  const [progress, , ready] = useStored("progress");
  const done = ready ? slugs.filter((s) => progress.lessons[s]).length : 0;
  if (slugs.length === 0) return <span className="stamp">Tools week</span>;
  return (
    <span className="stamp" aria-live="off">
      {done === slugs.length ? "✓ " : ""}
      {done} of {slugs.length} lessons done
    </span>
  );
}
