import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getLesson, getLessons } from "@/lib/content";
import { unitByNumber } from "@/content/course";
import { mdxComponents, Callout } from "@/components/mdx";
import { CompleteButton } from "@/components/CompleteButton";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  if (!lesson) return {};
  return { title: `${lesson.id} ${lesson.title}`, description: lesson.summary };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const lesson = getLesson((await params).slug);
  if (!lesson) notFound();
  const unit = unitByNumber(lesson.unit);
  const all = getLessons();
  const i = all.findIndex((l) => l.slug === lesson.slug);
  const prev = all[i - 1];
  const next = all[i + 1];

  return (
    <article>
      <nav aria-label="Breadcrumb" className="stamp no-print">
        <Link href={`/unit/${unit.slug}`} className="inline-flex min-h-11 items-center">
          Unit {unit.number} · {unit.title}
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/week/${lesson.week}`} className="inline-flex min-h-11 items-center">
          Week {lesson.week}
        </Link>
      </nav>
      <header className="mt-2 border-b-[1.5px] border-ink pb-5">
        <p className="stamp stamp-accent">
          Lesson {lesson.id} · {lesson.minutes} min read
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{lesson.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">{lesson.summary}</p>
      </header>

      <div className="prose mt-7">
        <MDXRemote source={lesson.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      {lesson.practice ? (
        <Callout label="Practice this week">
          <p>{lesson.practice}</p>
          <p className="no-print">
            <Link href={`/practice/log?week=${lesson.week}`}>Open the practice log →</Link>
          </p>
        </Callout>
      ) : null}

      <CompleteButton
        slug={lesson.slug}
        next={
          next
            ? { href: `/lesson/${next.slug}`, label: `${next.id} ${next.title}` }
            : { href: "/capstone", label: "The capstone" }
        }
      />

      <nav aria-label="Lesson" className="no-print mt-6 flex flex-wrap justify-between gap-3 text-base">
        {prev ? (
          <Link href={`/lesson/${prev.slug}`} className="inline-flex min-h-11 items-center">
            ← {prev.id} {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link href={`/week/${lesson.week}`} className="inline-flex min-h-11 items-center">
          Back to Week {lesson.week}
        </Link>
      </nav>
    </article>
  );
}
