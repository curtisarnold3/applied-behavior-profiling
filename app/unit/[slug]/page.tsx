import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ETHICS_LINE, units, weekByNumber } from "@/content/course";
import { lessonsForUnit } from "@/lib/content";
import { itemsForUnit } from "@/content/quizzes";
import { PageHeader, Section } from "@/components/PageHeader";
import { LessonList } from "@/components/LessonList";
import { Quiz } from "@/components/Quiz";
import { UnitDiagram } from "@/components/UnitDiagram";

export const dynamicParams = false;

export function generateStaticParams() {
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const unit = units.find((u) => u.slug === slug);
  if (!unit) return {};
  return { title: `Unit ${unit.number}: ${unit.title}`, description: unit.focus };
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = units.find((u) => u.slug === slug);
  if (!unit) notFound();
  const lessons = lessonsForUnit(unit.number);
  const quiz = itemsForUnit(unit.number);

  return (
    <>
      <PageHeader
        stamp={`Unit ${unit.number} · Week${unit.weeks.length > 1 ? "s" : ""} ${unit.weeks.join("–")}`}
        title={unit.title}
        lede={unit.focus}
      />
      <div className="space-y-4 text-lg">
        {unit.overview.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="mt-5 border-l-4 border-accent pl-4 italic" data-testid="ethics">
        {ETHICS_LINE}
      </p>

      <UnitDiagram unit={unit.number} />

      {unit.weeks.map((w) => {
        const week = weekByNumber(w);
        return (
          <Section key={w} id={`week-${w}`} title={`Week ${w}: ${week.title}`}>
            <LessonList lessons={lessons.filter((l) => l.week === w)} />
            <p className="mt-3">
              <Link href={`/week/${w}`}>Week {w} goals, practice, and check-off list →</Link>
            </p>
          </Section>
        );
      })}

      <Section id="takeaway" title="Key takeaway">
        <p className="text-lg">{unit.takeaway}</p>
      </Section>

      {unit.hasCheck ? (
        <Section id="check" title={`Unit ${unit.number} check`}>
          <Quiz items={quiz} scoreKey={`unit-${unit.number}`} title={`Unit ${unit.number} check`} />
          <p className="hint mt-3">
            Want more reps first? <Link href="/practice">Drill with flashcards</Link>.
          </p>
        </Section>
      ) : (
        <Section id="check" title="This week's work">
          <p>
            Unit 5 has no quiz. The work is the{" "}
            <Link href="/tools/self-assessment">self-assessment and milestone plan</Link>, the{" "}
            <Link href="/tools/limiting-beliefs">limiting-beliefs worksheet</Link>, and the{" "}
            <Link href="/capstone">capstone</Link>.
          </p>
        </Section>
      )}
    </>
  );
}
