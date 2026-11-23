import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unitByNumber, weeks } from "@/content/course";
import { lessonsForWeek } from "@/lib/content";
import { PageHeader, Section } from "@/components/PageHeader";
import { LessonList } from "@/components/LessonList";
import { WeekChecklist } from "@/components/WeekChecklist";

export const dynamicParams = false;

export function generateStaticParams() {
  return weeks.map((w) => ({ week: String(w.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ week: string }> }): Promise<Metadata> {
  const { week: param } = await params;
  const week = weeks.find((w) => String(w.number) === param);
  if (!week) return {};
  return { title: `Week ${week.number}: ${week.title}`, description: `Goals, lessons, practice, and deliverable for week ${week.number}.` };
}

export default async function WeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week: param } = await params;
  const week = weeks.find((w) => String(w.number) === param);
  if (!week) notFound();
  const unit = unitByNumber(week.unit);
  const lessons = lessonsForWeek(week.number);
  const prev = weeks.find((w) => w.number === week.number - 1);
  const next = weeks.find((w) => w.number === week.number + 1);

  return (
    <>
      <PageHeader
        stamp={`Week ${week.number} of 8 · Unit ${unit.number}`}
        title={week.title}
        lede={
          <>
            Part of <Link href={`/unit/${unit.slug}`}>Unit {unit.number}: {unit.title}</Link>. About an hour of
            lessons and two to three hours of practice.
          </>
        }
      />

      <Section id="goals" title="Goals">
        <ul className="space-y-2">
          {week.goals.map((g) => (
            <li key={g} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 bg-accent" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="lessons" title="Lessons">
        <LessonList lessons={lessons} />
      </Section>

      <Section id="practice" title="Practice">
        <ul className="space-y-3">
          {week.practice.map((p) => (
            <li key={p} className="border-l-4 border-rule pl-4">
              {p}
            </li>
          ))}
        </ul>
        <div className="no-print mt-4 flex flex-wrap gap-3">
          <Link href={`/practice/log?week=${week.number}`} className="btn">
            Practice log
          </Link>
          <Link href="/practice" className="btn">
            Drills
          </Link>
        </div>
      </Section>

      <Section id="deliverable" title="Deliverable">
        <p className="text-lg">
          <strong>{week.deliverable}</strong>
        </p>
        <div className="mt-4">
          <WeekChecklist week={week.number} items={week.checklist} />
        </div>
      </Section>

      <nav aria-label="Weeks" className="no-print mt-10 flex justify-between gap-3">
        {prev ? (
          <Link href={`/week/${prev.number}`} className="inline-flex min-h-11 items-center">
            ← Week {prev.number}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/week/${next.number}`} className="inline-flex min-h-11 items-center">
            Week {next.number} →
          </Link>
        ) : (
          <Link href="/capstone" className="inline-flex min-h-11 items-center">
            Capstone →
          </Link>
        )}
      </nav>
    </>
  );
}
