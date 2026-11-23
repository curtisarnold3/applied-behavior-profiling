import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Lesson loader. Each lesson is one MDX file in content/lessons with typed
 * frontmatter. Anything wrong (a missing field, a typo'd key, a lesson that
 * runs too long) throws here, which fails the build.
 */

const LESSON_DIR = path.join(process.cwd(), "content", "lessons");
export const MAX_WORDS = 1800;
const WORDS_PER_MINUTE = 200;

export const frontmatterSchema = z
  .object({
    id: z.string().regex(/^[1-5]\.(\d|10)$/, 'id must look like "2.3"'),
    title: z.string().min(3).max(80),
    unit: z.number().int().min(1).max(5),
    week: z.number().int().min(1).max(8),
    summary: z.string().min(20).max(220),
    practice: z.string().min(10).max(400).optional(),
  })
  .strict();

export type LessonMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  words: number;
  minutes: number;
};
export type Lesson = LessonMeta & { body: string };

export function countWords(mdx: string): number {
  const text = mdx
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|\-\[\]()]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function parseLesson(slug: string, source: string): Lesson {
  let data: Record<string, unknown>;
  let content: string;
  try {
    ({ data, content } = matter(source));
  } catch (err) {
    throw new Error(
      `Bad frontmatter in content/lessons/${slug}.mdx: ${(err as Error).message.split("\n")[0]} (tip: put quotes around text that contains a colon)`,
    );
  }
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
    throw new Error(`Bad frontmatter in content/lessons/${slug}.mdx: ${issues}`);
  }
  if (Number(parsed.data.id.split(".")[0]) !== parsed.data.unit)
    throw new Error(`content/lessons/${slug}.mdx: id ${parsed.data.id} doesn't belong to unit ${parsed.data.unit}`);
  const words = countWords(content);
  if (words > MAX_WORDS)
    throw new Error(`content/lessons/${slug}.mdx is ${words} words; the limit is ${MAX_WORDS} (a 10-minute read).`);
  return { ...parsed.data, slug, words, minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)), body: content };
}

function order(id: string): number {
  const [u, n] = id.split(".").map(Number);
  return (u ?? 0) * 100 + (n ?? 0);
}

let cache: Lesson[] | null = null;

export function getLessons(): Lesson[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = fs.existsSync(LESSON_DIR) ? fs.readdirSync(LESSON_DIR).filter((f) => f.endsWith(".mdx")) : [];
  const lessons = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Lesson filename "${file}" must be lowercase-with-dashes.`);
    return parseLesson(slug, fs.readFileSync(path.join(LESSON_DIR, file), "utf8"));
  });
  const ids = new Set<string>();
  for (const l of lessons) {
    if (ids.has(l.id)) throw new Error(`Two lessons share the id ${l.id}.`);
    ids.add(l.id);
  }
  lessons.sort((a, b) => order(a.id) - order(b.id));
  cache = lessons;
  return lessons;
}

export function getLessonMetas(): LessonMeta[] {
  return getLessons().map((lesson) => {
    const meta: Partial<Lesson> = { ...lesson };
    delete meta.body;
    return meta as LessonMeta;
  });
}

export function getLesson(slug: string): Lesson | undefined {
  return getLessons().find((l) => l.slug === slug);
}

export function lessonsForUnit(unit: number): LessonMeta[] {
  return getLessonMetas().filter((l) => l.unit === unit);
}
export function lessonsForWeek(week: number): LessonMeta[] {
  return getLessonMetas().filter((l) => l.week === week);
}
