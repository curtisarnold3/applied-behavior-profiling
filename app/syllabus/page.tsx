import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/PageHeader";
import { PrintButton } from "@/components/PrintButton";
import { ETHICS_LINE, groundRules, unit5Materials, units, weeks, unitByNumber } from "@/content/course";
import { capstone, courseOutcomes, grading } from "@/content/capstone";
import { needs, pillars, values } from "@/content/frameworks";
import { getLessonMetas } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syllabus",
  description: "The full 8-week syllabus: outcomes, units, weekly schedule, grading, and the capstone.",
};

function Table({ head, rows, label }: { head: string[]; rows: React.ReactNode[][]; label: string }) {
  return (
    <div className="prose !text-base">
      <div className="table-wrap" tabIndex={0} role="region" aria-label={`${label} (scrolls sideways on small screens)`}>
        <table>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SyllabusPage() {
  const lessons = getLessonMetas();
  return (
    <>
      <PageHeader stamp={`${site.course} · Course syllabus`} title="Syllabus" lede={`${site.name}. By ${site.author}.`} />
      <PrintButton label="Print the syllabus" />

      <Section id="overview" title="Course overview">
        <div className="space-y-4">
          <p>
            This 8-week course teaches you to work out <em>why</em> people act the way they do from what they
            say: which social need they are chasing, how they justify decisions, and what they value most. The
            last unit turns the lens inward, onto your own authority, habits, and limiting beliefs.
          </p>
          <p>
            The course treats behavior as patterned, not personal. Most adult behavior traces back to childhood
            strategies for earning friends, safety, and rewards. Once you can spot the pattern, you can stop
            reacting to the surface and respond to the person underneath it.
          </p>
          <p>
            This course covers profiling from language and conversation. Physical behavior monitoring and
            deception scoring are a separate course.
          </p>
          <p className="border-l-4 border-accent pl-4 italic">{ETHICS_LINE}</p>
        </div>
        <h3 className="mt-6 text-lg">By the end of the course, you will be able to:</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          {courseOutcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ol>
      </Section>

      <Section id="structure" title="Course structure and format">
        <p>
          The course runs 8 weeks in five units, about 3&ndash;4 hours a week: roughly 1 hour of lessons and
          2&ndash;3 hours of practice. Practice matters more than lessons. The goal is pattern recognition that
          becomes automatic, not memorized definitions.
        </p>
        <div className="mt-4">
          <Table
            label="Units"
            head={["Unit", "Weeks", "Focus", "Source lessons"]}
            rows={units.map((u) => [
              <Link key="l" href={`/unit/${u.slug}`}>
                {u.number}. {u.title}
              </Link>,
              u.weeks.join("–"),
              u.focus,
              u.sourceLessons,
            ])}
          />
        </div>
        <h3 className="mt-6 text-lg">Three ground rules carry through every unit</h3>
        <ul className="mt-3 space-y-2">
          {groundRules.map((r) => (
            <li key={r.title}>
              <strong>{r.title}</strong> {r.body}
            </li>
          ))}
        </ul>
        <h3 className="mt-6 text-lg">Practice runs on two tracks each week</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>
            <strong>Controlled practice:</strong> watch interviews, podcasts, or TV and log what you hear (need,
            pillar, value, the phrase that tipped you off).
          </li>
          <li>
            <strong>Live practice:</strong> short everyday conversations where you identify, test, and respond,
            then write a two-line debrief afterward.
          </li>
        </ol>
      </Section>

      {units.map((u) => {
        const inUnit = lessons.filter((l) => l.unit === u.number);
        return (
          <Section key={u.slug} id={`unit-${u.number}`} title={`Unit ${u.number}: ${u.title} (Week${u.weeks.length > 1 ? "s" : ""} ${u.weeks.join("–")})`}>
            <p>{u.overview[0]}</p>
            <div className="mt-4">
              <Table
                label={`Unit ${u.number} lessons`}
                head={["#", "Lesson", "Key ideas", "Practice"]}
                rows={inUnit.map((l) => [
                  l.id,
                  <Link key="l" href={`/lesson/${l.slug}`}>
                    {l.title}
                  </Link>,
                  l.summary,
                  l.practice ?? "",
                ])}
              />
            </div>
            {u.number === 2 ? (
              <div className="mt-5">
                <Table
                  label="The six needs"
                  head={["Need", "What you hear", "What they crave", "Language shift"]}
                  rows={needs.map((n) => [n.name, n.hear, n.craves, n.language])}
                />
              </div>
            ) : null}
            {u.number === 3 ? (
              <div className="mt-5">
                <Table
                  label="The six decision pillars"
                  head={["Pillar", "How they decide", "What you hear", "Frame your proposal as..."]}
                  rows={pillars.map((p) => [p.name, p.decides, p.hear, p.frame])}
                />
              </div>
            ) : null}
            {u.number === 4 ? (
              <>
                <div className="mt-5">
                  <Table
                    label="The six values"
                    head={["Value", "End goal", "What you notice"]}
                    rows={values.map((v) => [v.name, v.goal, v.notice])}
                  />
                </div>
                <p className="mt-5">The profile comes together as one sentence:</p>
                <p className="mt-2 border-l-4 border-accent pl-4 text-lg">
                  <strong>If I</strong> [decision pillar], <strong>then people will</strong> [meet my need],{" "}
                  <strong>so I can finally</strong> [value].
                </p>
              </>
            ) : null}
            {u.number === 5 ? (
              <div className="mt-5">
                <Table
                  label="Unit 5 materials"
                  head={["Material", "What it is", "How you use it"]}
                  rows={unit5Materials.map((m) => [
                    <Link key="l" href={m.href}>
                      {m.material}
                    </Link>,
                    m.what,
                    m.use,
                  ])}
                />
              </div>
            ) : null}
            {u.syllabus.map((item) => (
              <p key={item.label} className="mt-4">
                <strong>{item.label}:</strong> {item.text}
              </p>
            ))}
            <p className="mt-4">
              <strong>Key takeaway:</strong> {u.takeaway}
            </p>
          </Section>
        );
      })}

      <Section id="schedule" title="Schedule and assessment">
        <p>Assessment is based on practice, not recall. Logs and a field capstone count for most of the grade.</p>
        <h3 className="mt-5 text-lg">Weekly schedule</h3>
        <div className="mt-3">
          <Table
            label="Weekly schedule"
            head={["Week", "Unit", "Lessons", "Deliverable"]}
            rows={weeks.map((w) => [
              <Link key="l" href={`/week/${w.number}`}>
                {w.number}
              </Link>,
              unitByNumber(w.unit).title,
              lessons
                .filter((l) => l.week === w.number)
                .map((l) => l.title)
                .join(" · "),
              w.deliverable,
            ])}
          />
        </div>
        <h3 className="mt-6 text-lg">Grading</h3>
        <div className="mt-3">
          <Table label="Grading" head={["Component", "Weight"]} rows={grading.map((g) => [g.component, `${g.weight}%`])} />
        </div>
        <p className="hint mt-2 no-print">
          There&rsquo;s no teacher here, so the grade is a private scorecard you keep yourself on the{" "}
          <Link href="/progress">Progress page</Link>.
        </p>
      </Section>

      <Section id="capstone" title={capstone.title}>
        <p>{capstone.intro} For each one, submit:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          {capstone.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <p className="mt-4">{capstone.pass}</p>
        <p className="no-print mt-3">
          <Link href="/capstone">Open the capstone template →</Link>
        </p>
      </Section>

      <Section id="credits" title="Works cited">
        <p>
          The frameworks taught in this course are credited, in MLA format, on the{" "}
          <Link href="/credits">Credits and works cited</Link> page.
        </p>
      </Section>
    </>
  );
}
