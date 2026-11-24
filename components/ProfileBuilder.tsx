"use client";

import { useState } from "react";
import Link from "next/link";
import { needs, pillars, values, profileSentence } from "@/content/frameworks";
import { newId, today } from "@/lib/download";
import { trackOptions, weekOptions } from "@/lib/options";
import type { LogEntry } from "@/lib/schema";
import { useStored } from "@/lib/useStored";
import { ChoiceCards, SelectField, Status, TextField } from "./forms";
import { StorageNotice } from "./StorageNotice";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="sheet-soft p-4" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="flex items-baseline gap-3 text-xl">
        <span aria-hidden="true" className="font-mono text-sm font-semibold text-accent-deep">
          0{n}
        </span>
        <span>
          <span className="sr-only">Step {n}: </span>
          {title}
        </span>
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

function Cue({ cue, reveals, ask }: { cue: string; reveals: string; ask: string }) {
  return (
    <p>
      <strong>
        {cue} reveal {reveals}.
      </strong>{" "}
      {ask}
    </p>
  );
}

export function ProfileBuilder() {
  const [, setLog] = useStored("log");
  const [quote, setQuote] = useState("");
  const [context, setContext] = useState("");
  const [pillar, setPillar] = useState("");
  const [need, setNeed] = useState("");
  const [value, setValue] = useState("");
  const [alternative, setAlternative] = useState("");
  const [custom, setCustom] = useState<string | null>(null);
  const [week, setWeek] = useState("7");
  const [track, setTrack] = useState("live");
  const [status, setStatus] = useState("");

  const assembled = profileSentence({ pillar, need, value });
  const sentence = custom ?? assembled;
  const complete = Boolean(quote.trim() && pillar && need && value);

  const save = () => {
    if (!complete) {
      setStatus("Add the quote and pick a pillar, a need, and a value first.");
      return;
    }
    if (!alternative.trim()) {
      setStatus("Record one alternative read before saving. Ruling something out is half the skill.");
      return;
    }
    const entry: LogEntry = {
      id: newId(), date: today(), week: Number(week), track: track as LogEntry["track"], context, phrase: quote.trim(),
      need: need as LogEntry["need"], pillar: pillar as LogEntry["pillar"], value: value as LogEntry["value"],
      response: "", reaction: "", notes: `Profile: ${sentence}\nRuled out: ${alternative.trim()}`,
    };
    setLog((l) => [...l, entry]);
    setStatus(`Saved to the practice log under Week ${week}.`);
    setQuote(""); setContext(""); setPillar(""); setNeed(""); setValue(""); setAlternative(""); setCustom(null);
  };

  return (
    <div className="space-y-5">
      <StorageNotice />
      <Step n={1} title="The quote">
        <TextField
          label="What did they say, word for word?" value={quote} onChange={setQuote} multiline rows={3} testId="pb-quote"
          hint="Pick a statement they didn't have to make. Then ask: why did they feel the need to say it?"
        />
        <TextField label="Context" value={context} onChange={setContext} hint="Who and where, in a few words." testId="pb-context" />
      </Step>

      <Step n={2} title="The decision pillar">
        <ChoiceCards
          legend="How do they decide?" name="pillar" value={pillar} onChange={(v) => { setPillar(v); setCustom(null); }}
          hint={<Cue cue="Justifications" reveals="pillars" ask="What did they explain or defend? That's the filter they choose with." />}
          options={pillars.map((p) => ({ value: p.id, title: p.name, detail: <>{p.decides}. <em>{p.hear}</em></> }))}
        />
      </Step>

      <Step n={3} title="The need">
        <ChoiceCards
          legend="What are they chasing from people?" name="need" value={need} onChange={(v) => { setNeed(v); setCustom(null); }}
          hint={<Cue cue="Repetitions" reveals="needs" ask="What do they keep trying to get from the world, even when it doesn't work?" />}
          options={needs.map((n) => ({ value: n.id, title: n.name, detail: <>{n.craves}. <em>{n.hear}</em></> }))}
        />
      </Step>

      <Step n={4} title="The value">
        <ChoiceCards
          legend="What are they ultimately after?" name="value" value={value} onChange={(v) => { setValue(v); setCustom(null); }}
          hint={<Cue cue="Adjectives" reveals="values" ask="What do they admire or romanticize in other people? It's usually what they went without." />}
          options={values.map((v) => ({ value: v.id, title: v.name, detail: <>{v.goal}. <em>{v.hear}</em></> }))}
        />
      </Step>

      <Step n={5} title="One alternative read">
        <TextField
          label="What else could it be, and why did you rule it out?" value={alternative} onChange={setAlternative} multiline rows={3} testId="pb-alt"
          hint="For example: “Considered approval, but there was no checking for a verdict.”"
        />
      </Step>

      <section className="sheet p-4" aria-labelledby="result-h">
        <p className="stamp stamp-accent" id="result-h">
          The profile sentence
        </p>
        <p className="mt-2 text-xl leading-snug" data-testid="pb-sentence" aria-live="polite">
          {sentence}
        </p>
        <div className="mt-4">
          <TextField
            label="Reword it in their voice (optional)" value={sentence} onChange={setCustom} multiline rows={3} testId="pb-custom"
            hint="The template is a starting point. Rewrite it so it sounds like this person."
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField label="Course week" value={week} onChange={setWeek} options={weekOptions} placeholder={null} />
          <SelectField label="Track" value={track} onChange={setTrack} options={trackOptions} placeholder={null} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={save} data-testid="pb-save">
            Save to the practice log
          </button>
          <Link href={`/practice/log?week=${week}`} className="btn">
            Open the log
          </Link>
        </div>
        <Status>{status}</Status>
      </section>
    </div>
  );
}
