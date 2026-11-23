import type { Progress } from "./schema";

export type LessonRef = { slug: string; id: string; title: string; week: number; unit: number };

/** The first lesson, in course order, that isn't marked complete. null when all are done. */
export function nextLesson(lessons: LessonRef[], progress: Progress): LessonRef | null {
  return lessons.find((l) => !progress.lessons[l.slug]) ?? null;
}

export function percentDone(lessons: LessonRef[], progress: Progress): number {
  if (lessons.length === 0) return 0;
  return Math.round((lessons.filter((l) => progress.lessons[l.slug]).length / lessons.length) * 100);
}
