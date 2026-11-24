"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WEEKLY_LOG_TARGET } from "@/content/course";
import { logToCsv } from "@/lib/csv";
import { downloadFile, newId, today } from "@/lib/download";
import { cap, parseWeek, needOptions, pillarOptions, trackOptions, valueOptions, weekOptions } from "@/lib/options";
import { nextLesson, type LessonRef } from "@/lib/progress";
import { CURRENT_VERSION, ISO_DATE, type LogEntry } from "@/lib/schema";
import { read } from "@/lib/storage";
import { useStored } from "@/lib/useStored";
import { SelectField, Status, TextField } from "./forms";
import { StorageNotice } from "./StorageNotice";

const blank = (week: number): Omit<LogEntry, "id"> => ({
  date: today(), week, track: "controlled", context: "", phrase: "", need: "", pillar: "", value: "",
  response: "", reaction: "", notes: "",
});

function Log({ lessons }: { lessons: LessonRef[] }) {
  const params = useSearchParams();
  // Open on the week in the link; otherwise on the week the learner is currently in.
  const [startWeek] = useState(() => parseWeek(params.get("week")) ?? nextLesson(lessons, read("progress"))?.week ?? 8);

  const [log, setLog, ready] = useStored("log");
  const [draft, setDraft] = useState(() => blank(startWeek));
  const [filter, setFilter] = useState<string>(String(startWeek));
  const [status, setStatus] = useState("");
  const [undo, setUndo] = useState<LogEntry | null>(null);
  const set = <K extends keyof typeof draft>(key: K, v: (typeof draft)[K]) => setDraft((d) => ({ ...d, [key]: v }));

  const shown = log.filter((e) => filter === "all" || e.week === Number(filter)).sort((a, b) => b.date.localeCompare(a.date));
  const weekCount = filter === "all" ? null : log.filter((e) => e.week === Number(filter)).length;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.phrase.trim()) {
      setStatus("Add the exact phrase you heard first. That's the evidence.");
      return;
    }
    if (!ISO_DATE.test(draft.date)) {
      setStatus("That date doesn't look right. Use the date picker, or type it as year-month-day.");
      return;
    }
    if (!setLog((l) => [...l, { ...draft, id: newId() }])) {
      setStatus("That entry couldn't be saved. Check the date and try again. Nothing else was changed.");
      return;
    }
    setUndo(null);
    setFilter(String(draft.week));
    setDraft({ ...blank(draft.week), track: draft.track, date: draft.date });
    setStatus(`Entry added to Week ${draft.week}.`);
  };

  const exportCsv = () =>
    setStatus(downloadFile(`practice-log-${today()}.csv`, "text/csv;charset=utf-8", logToCsv(shown)) ? `Exported ${shown.length} entries as CSV.` : "The download was blocked by the browser.");
  const exportJson = () =>
    setStatus(
      downloadFile(
        `practice-log-${filter === "all" ? "all-weeks" : `week-${filter}`}-${today()}.json`, "application/json",
        JSON.stringify({ app: "abp", version: CURRENT_VERSION, exportedAt: new Date().toISOString(), data: { log: shown } }, null, 2),
      ) ? `Exported ${shown.length} entries as JSON.` : "The download was blocked by the browser.",
    );

  return (
    <>
      <StorageNotice />
      <form onSubmit={add} className="sheet space-y-4 p-4" aria-labelledby="add-h">
        <h2 id="add-h" className="text-xl">
          Add an entry
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Date" type="date" value={draft.date} onChange={(v) => set("date", v)} required testId="f-date" />
          <SelectField label="Course week" value={String(draft.week)} onChange={(v) => set("week", Number(v))} options={weekOptions} placeholder={null} testId="f-week" />
          <SelectField label="Track" value={draft.track} onChange={(v) => set("track", v as LogEntry["track"])} options={trackOptions} placeholder={null} testId="f-track" />
        </div>
        <TextField label="Context" value={draft.context} onChange={(v) => set("context", v)} hint="Where and who, in a few words. “Podcast interview,” “coffee with a coworker.”" testId="f-context" />
        <TextField label="Exact phrase heard" value={draft.phrase} onChange={(v) => set("phrase", v)} multiline rows={2} hint="Word for word. The phrase is the evidence." testId="f-phrase" />
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Need" value={draft.need} onChange={(v) => set("need", v as LogEntry["need"])} options={needOptions} testId="f-need" />
          <SelectField label="Pillar" value={draft.pillar} onChange={(v) => set("pillar", v as LogEntry["pillar"])} options={pillarOptions} testId="f-pillar" />
          <SelectField label="Value" value={draft.value} onChange={(v) => set("value", v as LogEntry["value"])} options={valueOptions} testId="f-value" />
        </div>
        <TextField label="My response" value={draft.response} onChange={(v) => set("response", v)} multiline rows={2} hint="Live track: what you said back." testId="f-response" />
        <TextField label="Their reaction" value={draft.reaction} onChange={(v) => set("reaction", v)} multiline rows={2} testId="f-reaction" />
        <TextField label="Notes" value={draft.notes} onChange={(v) => set("notes", v)} multiline rows={2} hint="An alternative read, or what you'd change next time." testId="f-notes" />
        <button type="submit" className="btn btn-primary" data-testid="add-entry">
          Add entry
        </button>
        <Status>{status}</Status>
      </form>

      <section aria-labelledby="entries-h" className="mt-10">
        <h2 id="entries-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Entries
        </h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-44">
            <SelectField label="Show" value={filter} onChange={setFilter} options={[{ value: "all", label: "All weeks" }, ...weekOptions]} placeholder={null} testId="filter-week" />
          </div>
          <button type="button" className="btn" onClick={exportCsv} data-testid="export-csv">
            Export CSV
          </button>
          <button type="button" className="btn" onClick={exportJson} data-testid="export-json">
            Export JSON
          </button>
        </div>
        {undo ? (
          <p className="no-print mt-3">
            <button
              type="button" className="btn btn-quiet" data-testid="undo-delete"
              onClick={() => {
                setLog((l) => (l.some((x) => x.id === undo.id) ? l : [...l, undo]));
                setUndo(null);
                setStatus("Entry restored.");
              }}
            >
              Undo delete
            </button>
          </p>
        ) : null}
        {weekCount !== null ? (
          <div className="mt-4" data-testid="week-count">
            <p className="stamp">
              Week {filter}: {ready ? weekCount : 0} of {WEEKLY_LOG_TARGET} entries{weekCount >= WEEKLY_LOG_TARGET ? " · ✓ target met" : ""}
            </p>
            <div className="mt-1 h-3 border-[1.5px] border-ink bg-card" aria-hidden="true">
              <div className="h-full bg-accent" style={{ width: `${Math.min(100, (weekCount / WEEKLY_LOG_TARGET) * 100)}%` }} />
            </div>
          </div>
        ) : (
          <p className="stamp mt-4">{ready ? log.length : 0} entries in all</p>
        )}

        {shown.length === 0 ? (
          <p className="hint mt-5">Nothing logged here yet. The first one is the hardest; after that it becomes a habit.</p>
        ) : (
          <ul className="mt-5 space-y-3" data-testid="entries">
            {shown.map((e) => (
              <li key={e.id} className="sheet-soft avoid-break p-3">
                <p className="stamp">
                  {e.date} · Week {e.week} · {e.track}
                  {e.context ? ` · ${e.context}` : ""}
                </p>
                <p className="mt-1 text-lg italic">&ldquo;{e.phrase}&rdquo;</p>
                <p className="mt-1 text-base">
                  {[e.need && `Need: ${cap(e.need)}`, e.pillar && `Pillar: ${cap(e.pillar)}`, e.value && `Value: ${cap(e.value)}`].filter(Boolean).join(" · ") || "No read recorded yet"}
                </p>
                {e.response ? <p className="mt-1 text-base"><strong>I said:</strong> {e.response}</p> : null}
                {e.reaction ? <p className="text-base"><strong>They:</strong> {e.reaction}</p> : null}
                {e.notes ? <p className="hint whitespace-pre-line">{e.notes}</p> : null}
                <button
                  type="button"
                  className="no-print mt-1 min-h-11 text-base underline"
                  onClick={() => {
                    setLog((l) => l.filter((x) => x.id !== e.id));
                    setUndo(e);
                    setStatus("Entry deleted.");
                  }}
                >
                  Delete<span className="sr-only"> entry: {e.phrase.slice(0, 40)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export function PracticeLog({ lessons }: { lessons: LessonRef[] }) {
  return (
    <Suspense fallback={<p className="hint">Loading the log…</p>}>
      <Log lessons={lessons} />
    </Suspense>
  );
}
