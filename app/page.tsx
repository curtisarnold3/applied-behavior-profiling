import Link from "next/link";
import { site } from "@/lib/site";
import { units, weeks, groundRules, unitByNumber } from "@/content/course";
import { getLessonMetas } from "@/lib/content";
import { ResumeButton, LessonTally } from "@/components/ResumeButton";
import { tools } from "@/content/tools";
import { StorageNotice } from "@/components/StorageNotice";

const outcomes = [
  "Hear which social need a person is chasing, and answer it in language that lands",
  "Name the filter someone uses to justify a decision, and frame a request to fit",
  "Recognize what a person values most, and connect to it",
  "Build a one-sentence working profile, and catch your own misreads",
  "Rate your own authority and write a dated plan to raise it",
];

export default function Home() {
  const lessons = getLessonMetas();
  const refs = lessons.map(({ slug, id, title, week, unit }) => ({ slug, id, title, week, unit }));

  return (
    <>
      <section aria-labelledby="hero-h" className="pt-4">
        <p className="stamp stamp-accent">{site.course} · 8-week field course</p>
        <h1 id="hero-h" className="mt-3 text-[2.1rem] leading-[1.05] sm:text-5xl">
          People Don&rsquo;t Want to Be Fixed&hellip;{" "}
          <span className="text-accent-deep">They Want to Be Seen &amp; Not Judged</span>
        </h1>
        <p className="mt-5 text-xl leading-snug">
          Most of us listen to <em>what</em> people say. In eight weeks, we&rsquo;ll learn to hear <em>why</em>{" "}
          they felt the need to say it.
        </p>
        <p className="mt-3 text-ink-soft">
          Short lessons you can read on a phone in under ten minutes. Then the real work: drills, a practice
          log, and field cards for your pocket. About 3&ndash;4 hours a week, most of it practice.
        </p>
        <div className="mt-6">
          <StorageNotice />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ResumeButton lessons={refs} />
          <Link href="/syllabus" className="btn">
            Read the syllabus
          </Link>
        </div>
        <p className="hint mt-4">{site.ethics}</p>
      </section>

      <section aria-labelledby="map-h" id="map" className="mt-12">
        <h2 id="map-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          The 8-week map
        </h2>
        <ol className="mt-5 space-y-3">
          {weeks.map((week) => {
            const unit = unitByNumber(week.unit);
            const inWeek = lessons.filter((l) => l.week === week.number);
            return (
              <li key={week.number}>
                <Link
                  href={`/week/${week.number}`}
                  className="sheet-soft flex items-stretch text-ink no-underline hover:border-ink"
                >
                  <span
                    aria-hidden="true"
                    className="flex w-14 shrink-0 items-center justify-center border-r border-rule bg-paper-deep font-display text-2xl font-extrabold"
                  >
                    {week.number}
                  </span>
                  <span className="block min-w-0 flex-1 px-3 py-3">
                    <span className="stamp block">
                      <span className="sr-only">Week {week.number}, </span>Unit {unit.number} · {unit.title}
                    </span>
                    <span className="mt-0.5 block font-display text-lg font-bold leading-tight">{week.title}</span>
                    <span className="mt-1 block">
                      <LessonTally slugs={inWeek.map((l) => l.slug)} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="promise-h" className="mt-12">
        <h2 id="promise-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          By the end, you&rsquo;ll be able to
        </h2>
        <ul className="mt-4 space-y-2">
          {outcomes.map((o) => (
            <li key={o} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 bg-accent" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="units-h" className="mt-12">
        <h2 id="units-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Five units
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {units.map((u) => (
            <li key={u.slug} className="sheet-soft p-4">
              <p className="stamp">
                Unit {u.number} · Week{u.weeks.length > 1 ? "s" : ""} {u.weeks.join("–")}
              </p>
              <h3 className="mt-1 text-lg">
                <Link href={`/unit/${u.slug}`} className="inline-flex min-h-11 items-center">
                  {u.title}
                </Link>
              </h3>
              <p className="hint mt-1">{u.focus}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rules-h" className="mt-12">
        <h2 id="rules-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Three ground rules
        </h2>
        <ol className="mt-4 space-y-4">
          {groundRules.map((r, i) => (
            <li key={r.title} className="flex gap-4">
              <span aria-hidden="true" className="font-mono text-sm font-semibold text-accent-deep">
                0{i + 1}
              </span>
              <p>
                <strong>{r.title}</strong> {r.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tools-h" className="mt-12">
        <h2 id="tools-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          The kit
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {tools.map((t) => (
            <li key={t.href} className="sheet-soft p-4">
              <h3 className="text-lg">
                <Link href={t.href} className="inline-flex min-h-11 items-center">
                  {t.title}
                </Link>
              </h3>
              <p className="hint mt-1">{t.blurb}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
