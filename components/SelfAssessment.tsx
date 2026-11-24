"use client";

import { useState } from "react";
import { habits, LEVEL_NAMES, lowest, nextLevelGoal, traits, type Scale } from "@/content/assessment";
import { newId } from "@/lib/download";
import { ISO_DATE, type Assessment, type Milestone } from "@/lib/schema";
import { useStored } from "@/lib/useStored";
import { SelectField, Status, TextField } from "./forms";
import { PrintButton } from "./PrintButton";
import { StorageNotice } from "./StorageNotice";

function ScaleCard({ scale, group, value, onChange }: { scale: Scale; group: string; value: number | undefined; onChange: (level: number) => void }) {
  return (
    <fieldset className="sheet-soft avoid-break p-4">
      <legend className="float-left mb-1 w-full font-display text-xl font-extrabold">{scale.name}</legend>
      <p className="hint clear-both">{scale.prompt}</p>
      <div className="mt-3 space-y-2">
        {scale.levels.map((text, i) => {
          const level = i + 1;
          const checked = value === level;
          return (
            <label
              key={level}
              className={`flex cursor-pointer gap-3 rounded-[3px] border-[1.5px] p-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy ${checked ? "border-ink bg-paper-deep" : "border-rule bg-card"}`}
            >
              <input
                type="radio" name={`${group}-${scale.id}`} value={level} checked={checked} onChange={() => onChange(level)}
                className="mt-1 h-6 w-6 shrink-0 accent-[#b93c0a]" data-testid={`${group}-${scale.id}-${level}`}
              />
              <span>
                <span className="stamp block">
                  Level {level} · {LEVEL_NAMES[i]}
                  {checked ? " · selected" : ""}
                </span>
                <span className="block leading-snug">{text}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Bars({ scales, ratings, lowIds }: { scales: Scale[]; ratings: Partial<Record<string, number>>; lowIds: string[] }) {
  return (
    <ul className="space-y-2">
      {scales.map((s) => {
        const level = ratings[s.id];
        const low = lowIds.includes(s.id);
        return (
          <li key={s.id} className="flex items-center gap-3">
            <span className="w-28 shrink-0 font-display font-bold">{s.name}</span>
            <span className="flex flex-1 gap-1" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`h-4 flex-1 border-[1.5px] border-ink ${level && n <= level ? (low ? "bg-accent" : "bg-ink") : "bg-card"}`} />
              ))}
            </span>
            <span className="stamp w-24 shrink-0 text-right">
              {level ? `${level} of 5` : "not rated"}
              {low ? " · lowest" : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SelfAssessment() {
  const [assessment, setAssessment, ready] = useStored("assessment");
  const [plan, setPlan] = useStored("plan");
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState({ focus: "", step: "", due: "" });

  const rate = (kind: "traits" | "habits", id: string, level: number) =>
    setAssessment((a) => ({ ...a, [kind]: { ...a[kind], [id]: level }, date: new Date().toISOString() }) as Assessment);

  const lowTraits = lowest(traits, assessment.traits);
  const lowHabits = lowest(habits, assessment.habits);
  const ratedCount = Object.keys(assessment.traits).length + Object.keys(assessment.habits).length;
  const done = ratedCount === 10;
  const focusOptions = [...lowTraits, ...lowHabits].map((r) => ({ value: r.scale.name, label: `${r.scale.name} (lowest, level ${r.level})` }));
  const otherOptions = [...traits, ...habits].filter((s) => !focusOptions.some((f) => f.value === s.name)).map((s) => ({ value: s.name, label: s.name }));

  const addStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.step.trim() || !draft.due) {
      setStatus("A milestone needs a step and a date. A step without a date is a wish.");
      return;
    }
    if (!ISO_DATE.test(draft.due)) {
      setStatus("That date doesn't look right. Use the date picker, or type it as year-month-day.");
      return;
    }
    const m: Milestone = { id: newId(), focus: draft.focus || focusOptions[0]?.value || "General", step: draft.step.trim(), due: draft.due, done: false };
    setPlan((p) => [...p, m].sort((a, b) => a.due.localeCompare(b.due)));
    setDraft({ focus: draft.focus, step: "", due: "" });
    setStatus("Milestone added.");
  };

  return (
    <>
      <StorageNotice />
      <div className="no-print">
        <h2 className="border-t-[1.5px] border-ink pt-3 text-2xl">Part 1: Five traits</h2>
        <p className="mt-2">
          For each trait, pick the level that best describes the <strong>last month</strong>. If you&rsquo;re torn
          between two, take the lower one.
        </p>
        <div className="mt-4 space-y-5">
          {traits.map((t) => (
            <ScaleCard key={t.id} scale={t} group="trait" value={ready ? assessment.traits[t.id as keyof Assessment["traits"]] : undefined} onChange={(l) => rate("traits", t.id, l)} />
          ))}
        </div>

        <h2 className="mt-10 border-t-[1.5px] border-ink pt-3 text-2xl">Part 2: Five habit areas</h2>
        <p className="mt-2">Same again for the habits that sit underneath the traits.</p>
        <div className="mt-4 space-y-5">
          {habits.map((h) => (
            <ScaleCard key={h.id} scale={h} group="habit" value={ready ? assessment.habits[h.id as keyof Assessment["habits"]] : undefined} onChange={(l) => rate("habits", h.id, l)} />
          ))}
        </div>
      </div>

      <section id="results" aria-labelledby="results-h" className="mt-10">
        <h2 id="results-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Your results
        </h2>
        <p className="stamp mt-2" aria-live="polite" data-testid="rated-count">
          {ready ? ratedCount : 0} of 10 rated
        </p>
        <div className="sheet avoid-break mt-4 p-4">
          <p className="stamp stamp-accent">Internal · traits</p>
          <div className="mt-2">
            <Bars scales={traits} ratings={assessment.traits} lowIds={lowTraits.map((r) => r.scale.id)} />
          </div>
          <p className="stamp stamp-accent mt-5">Underlying · habits</p>
          <div className="mt-2">
            <Bars scales={habits} ratings={assessment.habits} lowIds={lowHabits.map((r) => r.scale.id)} />
          </div>
        </div>

        {lowTraits.length + lowHabits.length > 0 ? (
          <div className="mt-5 space-y-4" data-testid="focus">
            <p>
              <strong>Fix the weakness first.</strong> Your lowest trait has the biggest effect on your influence.
              {!done ? " (Rate all ten for the full picture.)" : ""}
            </p>
            {[...lowTraits.map((r) => ({ r, kind: "Lowest trait" })), ...lowHabits.map((r) => ({ r, kind: "Lowest habit area" }))].map(({ r, kind }) => {
              const goal = nextLevelGoal(r);
              return (
                <div key={kind + r.scale.id} className="sheet-soft avoid-break border-l-4 border-l-accent p-4" data-testid={`low-${r.scale.id}`}>
                  <p className="stamp stamp-accent">
                    {kind} · {r.scale.name} · level {r.level}
                  </p>
                  {r.level === 5 ? (
                    <p className="mt-1">
                      <strong>You rated this at the top level.</strong> The work now is holding it there, and helping
                      someone else climb.
                    </p>
                  ) : (
                    <p className="mt-1">
                      <strong>
                        Your goal is level {goal.level} ({LEVEL_NAMES[goal.level - 1]}):
                      </strong>{" "}
                      {goal.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="hint mt-4">Rate the traits and habits above and your lowest two will show here, with the next level as the goal.</p>
        )}
      </section>

      <section id="plan" aria-labelledby="plan-h" className="mt-10">
        <h2 id="plan-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Milestone plan
        </h2>
        <p className="mt-2">
          Dated steps to raise your lowest trait and your lowest habit area by <strong>one level</strong>. Small
          and specific beats ambitious and vague.
        </p>
        <form onSubmit={addStep} className="sheet no-print mt-4 space-y-4 p-4">
          <SelectField
            label="This step is for" value={draft.focus} onChange={(v) => setDraft((d) => ({ ...d, focus: v }))}
            options={[...focusOptions, ...otherOptions]} placeholder={focusOptions.length ? null : "General"} testId="plan-focus"
          />
          <TextField label="The step" value={draft.step} onChange={(v) => setDraft((d) => ({ ...d, step: v }))} multiline rows={2} hint="Something you could tick off. “Write down every promise I make, for two weeks.”" testId="plan-step" />
          <TextField label="Do it by" type="date" value={draft.due} onChange={(v) => setDraft((d) => ({ ...d, due: v }))} testId="plan-due" />
          <button type="submit" className="btn btn-primary" data-testid="plan-add">
            Add milestone
          </button>
          <Status>{status}</Status>
        </form>

        {plan.length === 0 ? (
          <p className="hint mt-4">No milestones yet.</p>
        ) : (
          <ol className="mt-4 space-y-2" data-testid="plan-list">
            {plan.map((m) => (
              <li key={m.id} className="sheet-soft avoid-break flex items-start gap-3 p-3">
                <input
                  id={`m-${m.id}`} type="checkbox" checked={m.done} className="mt-1.5 h-6 w-6 shrink-0 accent-[#b93c0a]"
                  onChange={(e) => setPlan((p) => p.map((x) => (x.id === m.id ? { ...x, done: e.target.checked } : x)))}
                />
                <div className="min-w-0 flex-1">
                  <label htmlFor={`m-${m.id}`} className={m.done ? "line-through decoration-1" : ""}>
                    {m.step}
                  </label>
                  <p className="stamp mt-1">
                    {m.focus} · by {m.due}
                    {m.done ? " · ✓ done" : ""}
                  </p>
                </div>
                <button type="button" className="no-print min-h-11 text-base underline" onClick={() => setPlan((p) => p.filter((x) => x.id !== m.id))}>
                  Remove<span className="sr-only"> milestone: {m.step.slice(0, 40)}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-8">
        <PrintButton label="Print results and plan" />
      </div>
    </>
  );
}
