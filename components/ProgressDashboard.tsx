"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { units, weeks, WEEKLY_LOG_TARGET } from "@/content/course";
import { downloadFile, today } from "@/lib/download";
import { nextLesson, percentDone, type LessonRef } from "@/lib/progress";
import { scorecard } from "@/lib/rubric";
import { exportAll, importAll, resetAll } from "@/lib/storage";
import { useStored } from "@/lib/useStored";
import { Status } from "./forms";
import { StorageNotice } from "./StorageNotice";

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-3 border-[1.5px] border-ink bg-card" role="img" aria-label={`${label}: ${value} of ${max}`}>
      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ProgressDashboard({ lessons }: { lessons: LessonRef[] }) {
  const [progress, , ready] = useStored("progress");
  const [log] = useStored("log");
  const [quiz] = useStored("quiz");
  const [capstone] = useStored("capstone");
  const [assessment] = useStored("assessment");
  const [plan] = useStored("plan");
  const [status, setStatus] = useState("");
  const [confirming, setConfirming] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const next = nextLesson(lessons, progress);
  const card = scorecard({ log, quiz, capstone, assessment, plan });
  const doneCount = lessons.filter((l) => progress.lessons[l.slug]).length;

  const doExport = () =>
    setStatus(downloadFile(`seen-not-fixed-backup-${today()}.json`, "application/json", JSON.stringify(exportAll(), null, 2)) ? "Backup downloaded. Keep the file somewhere safe." : "The download was blocked by the browser.");

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5_000_000) {
      setStatus("That file is too large to be a backup from this site.");
      return;
    }
    try {
      const result = importAll(await file.text());
      setStatus(result.ok ? `Imported: ${result.keys.join(", ") || "nothing (the file was empty)"}.` : `Import failed. ${result.error} Nothing was changed.`);
    } catch {
      setStatus("That file couldn't be read. Nothing was changed.");
    }
  };

  return (
    <>
      <StorageNotice />
      <section aria-labelledby="where-h">
        <h2 id="where-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Where you are
        </h2>
        <p className="mt-3 text-lg" data-testid="overall">
          {ready ? doneCount : 0} of {lessons.length} lessons complete ({ready ? percentDone(lessons, progress) : 0}%).
        </p>
        <div className="mt-2">
          <Bar value={ready ? doneCount : 0} max={lessons.length} label="Lessons complete" />
        </div>
        <p className="mt-3">
          {next ? (
            <Link href={`/lesson/${next.slug}`} className="btn btn-primary">
              {doneCount === 0 ? "Start Week 1" : `Resume Week ${next.week}, Lesson ${next.id}`}
            </Link>
          ) : (
            <Link href="/capstone" className="btn btn-primary">
              All lessons done: open the capstone
            </Link>
          )}
        </p>
        <ul className="mt-5 space-y-3">
          {units.map((u) => {
            const inUnit = lessons.filter((l) => l.unit === u.number);
            const done = inUnit.filter((l) => progress.lessons[l.slug]).length;
            return (
              <li key={u.slug}>
                <p className="flex justify-between gap-3">
                  <Link href={`/unit/${u.slug}`}>
                    Unit {u.number}: {u.title}
                  </Link>
                  <span className="stamp shrink-0">
                    {ready ? done : 0}/{inUnit.length}
                  </span>
                </p>
                <Bar value={ready ? done : 0} max={inUnit.length} label={`Unit ${u.number} lessons`} />
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="weeks-h" className="mt-10">
        <h2 id="weeks-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Week by week
        </h2>
        <div className="prose mt-3 !text-base">
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Weekly progress (scrolls sideways on small screens)">
            <table>
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  <th scope="col">Lessons</th>
                  <th scope="col">Log entries</th>
                  <th scope="col">Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => {
                  const inWeek = lessons.filter((l) => l.week === w.number);
                  const d = w.checklist.filter((c) => progress.deliverables[c.id]).length;
                  return (
                    <tr key={w.number}>
                      <th scope="row" className="!border-b !border-rule-soft !font-serif !text-base !normal-case !tracking-normal">
                        <Link href={`/week/${w.number}`}>Week {w.number}</Link>
                      </th>
                      <td>
                        {ready ? inWeek.filter((l) => progress.lessons[l.slug]).length : 0}/{inWeek.length}
                      </td>
                      <td>
                        {ready ? log.filter((e) => e.week === w.number).length : 0}/{WEEKLY_LOG_TARGET}
                      </td>
                      <td>
                        {ready ? d : 0}/{w.checklist.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="score-h" className="mt-10">
        <h2 id="score-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Your scorecard
        </h2>
        <p className="mt-2">
          There&rsquo;s no teacher here, so this is a private, self-kept score using the syllabus weights. It fills
          in from your own logs, unit checks, capstone, and plan.
        </p>
        <div className="sheet mt-4 p-4" data-testid="scorecard">
          <ul className="space-y-4">
            {card.rows.map((r) => (
              <li key={r.id}>
                <p className="flex justify-between gap-3">
                  <span className="font-display font-bold">{r.label}</span>
                  <span className="stamp shrink-0" data-testid={`score-${r.id}`}>
                    {ready ? r.points : 0} / {r.weight}
                  </span>
                </p>
                <Bar value={ready ? r.points : 0} max={r.weight} label={r.label} />
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t-[1.5px] border-ink pt-3 font-display text-2xl font-extrabold" data-testid="score-total">
            {ready ? card.total : 0} / 100
          </p>
        </div>
        <details className="mt-3">
          <summary className="flex min-h-11 cursor-pointer items-center underline">How each part is scored</summary>
          <ul className="list-disc space-y-1 pl-6 text-base">
            <li>Practice logs (40): entries in Weeks 3&ndash;7, up to {WEEKLY_LOG_TARGET} a week.</li>
            <li>Unit checks (20): your best result on the Unit 1, 2, and 3 checks, averaged. The Unit 4 check is for practice only.</li>
            <li>Capstone (30): how much of the three profiles is filled in, plus your own pass checks.</li>
            <li>Self-development plan (10): half for all ten self-assessment ratings, half for two dated milestones.</li>
          </ul>
        </details>
      </section>

      <section aria-labelledby="data-h" className="mt-10">
        <h2 id="data-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Your data
        </h2>
        <p className="mt-2">
          Everything lives in this browser and nowhere else. Export a backup now and then, especially before
          clearing your browser or switching devices.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={doExport} data-testid="export-all">
            Export all (JSON)
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()} data-testid="import-btn">
            Import a backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={onFile} data-testid="import-file" aria-label="Choose a backup file to import" tabIndex={-1} />
          {!confirming ? (
            <button type="button" className="btn" onClick={() => setConfirming(true)} data-testid="reset">
              Reset all data
            </button>
          ) : null}
        </div>
        {confirming ? (
          <div role="alertdialog" aria-labelledby="reset-h" aria-describedby="reset-d" className="sheet mt-4 border-accent-deep p-4">
            <h3 id="reset-h" className="text-lg">
              Erase everything?
            </h3>
            <p id="reset-d" className="mt-1">
              This deletes your progress, practice log, quiz scores, assessment, plan, beliefs, and capstone from
              this browser. It can&rsquo;t be undone unless you have a backup file.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button" className="btn btn-primary" data-testid="reset-confirm" autoFocus
                onClick={() => {
                  resetAll();
                  setConfirming(false);
                  setStatus("All data erased from this browser.");
                }}
              >
                Yes, erase it all
              </button>
              <button type="button" className="btn" onClick={() => setConfirming(false)} data-testid="reset-cancel">
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        <Status>{status}</Status>
      </section>
    </>
  );
}
