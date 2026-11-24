"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { units, weeks, WEEKLY_LOG_TARGET } from "@/content/course";
import { downloadFile, today } from "@/lib/download";
import { nextLesson, percentDone, type LessonRef } from "@/lib/progress";
import { LOG_WEEKS, scorecard } from "@/lib/rubric";
import { applyImport, exportAll, planImport, resetAll, type ImportPlan } from "@/lib/storage";
import { useStored } from "@/lib/useStored";
import { Status } from "./forms";
import { StorageNotice } from "./StorageNotice";

/** Escape closes a dialog; Tab cycles through its buttons instead of leaving it. */
function dialogKeys(e: React.KeyboardEvent<HTMLDivElement>, close: () => void) {
  if (e.key === "Escape") {
    close();
    return;
  }
  if (e.key !== "Tab") return;
  const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
  const first = buttons[0];
  const last = buttons[buttons.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last?.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first?.focus();
  }
}

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
  const resetRef = useRef<HTMLButtonElement>(null);
  const importRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState<{ text: string; name: string; plan: Extract<ImportPlan, { ok: true }> } | null>(null);
  const [replaceArmed, setReplaceArmed] = useState(false);
  const refocus = (ref: React.RefObject<HTMLButtonElement | null>) => setTimeout(() => ref.current?.focus(), 0);

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
      const text = await file.text();
      const plan = planImport(text, "merge");
      if (!plan.ok) {
        setPending(null);
        setStatus(`Import failed. ${plan.error} Nothing was changed.`);
        return;
      }
      if (plan.lines.length === 0) {
        setPending(null);
        setStatus("That backup is empty, so there is nothing to import.");
        return;
      }
      setReplaceArmed(false);
      setPending({ text, name: file.name, plan });
      setStatus("");
    } catch {
      setStatus("That file couldn't be read. Nothing was changed.");
    }
  };

  const cancelImport = () => {
    setPending(null);
    setStatus("Import cancelled. Nothing was changed.");
    refocus(importRef);
  };

  const finishImport = (mode: "merge" | "replace") => {
    if (!pending) return;
    // Work from what's stored right now, not from when the file was chosen, so nothing
    // added (or erased) while this dialog was open is undone.
    const plan = planImport(pending.text, mode);
    const result = plan.ok ? applyImport(plan) : plan;
    setPending(null);
    setReplaceArmed(false);
    setStatus(
      result.ok
        ? mode === "merge"
          ? "Import done. Everything you already had was kept; only missing items were added."
          : "Import done. The sections in the file replaced what was here."
        : `Import failed. ${result.error} Nothing was changed.`,
    );
    refocus(importRef);
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
                        {ready ? log.filter((e) => e.week === w.number).length : 0}
                        {(LOG_WEEKS as readonly number[]).includes(w.number) ? `/${WEEKLY_LOG_TARGET}` : ""}
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
          clearing your browser or switching devices. Importing shows you exactly what it will do before anything
          changes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={doExport} data-testid="export-all">
            Export all (JSON)
          </button>
          <button ref={importRef} type="button" className="btn" onClick={() => fileRef.current?.click()} data-testid="import-btn">
            Import a backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={onFile} data-testid="import-file" aria-label="Choose a backup file to import" tabIndex={-1} />
          {!confirming ? (
            <button ref={resetRef} type="button" className="btn" onClick={() => setConfirming(true)} data-testid="reset">
              Reset all data
            </button>
          ) : null}
        </div>
        {confirming ? (
          <div
            role="alertdialog" aria-modal="true" aria-labelledby="reset-h" aria-describedby="reset-d" className="sheet mt-4 border-accent-deep p-4"
            onKeyDown={(e) =>
              dialogKeys(e, () => {
                setConfirming(false);
                refocus(resetRef);
              })
            }
          >
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
                  setPending(null);
                  setStatus("All data erased from this browser.");
                  refocus(resetRef);
                }}
              >
                Yes, erase it all
              </button>
              <button
                type="button" className="btn" data-testid="reset-cancel"
                onClick={() => {
                  setConfirming(false);
                  refocus(resetRef);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        {pending ? (
          <div
            role="alertdialog" aria-modal="true" aria-labelledby="imp-h" aria-describedby="imp-d" className="sheet mt-4 p-4" data-testid="import-preview"
            onKeyDown={(e) => dialogKeys(e, cancelImport)}
          >
            <h3 id="imp-h" className="text-lg">
              Import &ldquo;{pending.name.slice(0, 60)}&rdquo;?
            </h3>
            <div id="imp-d">
              <p className="mt-1">
                <strong>Add what&rsquo;s missing</strong> never changes or removes anything you have now. Here is what
                it would do:
              </p>
              <ul className="mt-2 space-y-1 text-base" data-testid="import-lines">
                {pending.plan.lines.map((l) => (
                  <li key={l.key}>
                    <strong>{l.label}:</strong> {l.note}.
                  </li>
                ))}
              </ul>
              <p className="hint mt-2">Entries you deleted after making this backup will come back, because the file still has them.</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" autoFocus onClick={() => finishImport("merge")} data-testid="import-merge">
                Add what&rsquo;s missing
              </button>
              <button type="button" className="btn" data-testid="import-cancel" onClick={cancelImport}>
                Cancel
              </button>
            </div>
            <div className="mt-4 border-t border-rule pt-3">
              <p className="text-base">
                Or go back to exactly what&rsquo;s in the file. This <strong>overwrites</strong> the{" "}
                {pending.plan.lines.map((l) => l.label.toLowerCase()).join(", ")} you have now with the file&rsquo;s
                version, including anything you&rsquo;ve done since.
              </p>
              {!replaceArmed ? (
                <button type="button" className="btn btn-quiet mt-2" onClick={() => setReplaceArmed(true)} data-testid="import-replace">
                  Replace with the file instead…
                </button>
              ) : (
                <button type="button" className="btn mt-2" onClick={() => finishImport("replace")} data-testid="import-replace-confirm">
                  Yes, overwrite with the file
                </button>
              )}
            </div>
          </div>
        ) : null}
        <Status>{status}</Status>
      </section>
    </>
  );
}
