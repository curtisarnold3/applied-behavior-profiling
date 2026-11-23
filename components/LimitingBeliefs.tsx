"use client";

import { useState } from "react";
import { beliefDomains, beliefStarters, testQuestions } from "@/content/beliefs";
import { newId } from "@/lib/download";
import type { Belief } from "@/lib/schema";
import { useStored } from "@/lib/useStored";
import { SelectField, Status, TextField } from "./forms";
import { PrintButton } from "./PrintButton";
import { StorageNotice } from "./StorageNotice";

export function LimitingBeliefs() {
  const [beliefs, setBeliefs] = useStored("beliefs");
  const [text, setText] = useState("");
  const [domain, setDomain] = useState<string>(beliefDomains[4]);
  const [status, setStatus] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setStatus("Write the belief as a sentence first.");
      return;
    }
    const b: Belief = { id: newId(), belief: text.trim(), domain, source: "", exception: "", helping: "", inCharge: "", coach: "", opposite: "" };
    setBeliefs((list) => [...list, b]);
    setText("");
    setStatus("Belief added. Now put it through the questions below.");
  };
  const patch = (id: string, field: keyof Belief, v: string) => setBeliefs((list) => list.map((b) => (b.id === id ? { ...b, [field]: v } : b)));

  return (
    <>
      <StorageNotice />
      <section aria-labelledby="starters-h" className="no-print">
        <h2 id="starters-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Step 1: Let them surface
        </h2>
        <p className="mt-2">Finish any of these quickly, without editing. Whatever comes out first is worth a look.</p>
        <ul className="mt-3 space-y-2">
          {beliefStarters.map((s) => (
            <li key={s}>
              <button type="button" className="min-h-11 w-full rounded-[3px] border border-rule bg-card px-3 py-2 text-left italic" onClick={() => setText(s.replace(/\.\.\.$/, " "))}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="list-h" className="mt-8">
        <h2 id="list-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Step 2: List the beliefs
        </h2>
        <form onSubmit={add} className="sheet no-print mt-4 space-y-4 p-4">
          <TextField label="A belief that might be holding me back" value={text} onChange={setText} multiline rows={2} hint="Write it as a plain sentence. “I'm just not a confident person.”" testId="belief-text" />
          <SelectField label="Area of life" value={domain} onChange={setDomain} options={beliefDomains.map((d) => ({ value: d, label: d }))} placeholder={null} testId="belief-domain" />
          <button type="submit" className="btn btn-primary" data-testid="belief-add">
            Add belief
          </button>
          <Status>{status}</Status>
        </form>
      </section>

      <section aria-labelledby="test-h" className="mt-8">
        <h2 id="test-h" className="border-t-[1.5px] border-ink pt-3 text-2xl">
          Step 3: Test each one, then flip it
        </h2>
        {beliefs.length === 0 ? (
          <p className="hint mt-3">Add a belief above and it&rsquo;ll appear here with the four test questions.</p>
        ) : (
          <ol className="mt-4 space-y-6" data-testid="belief-list">
            {beliefs.map((b, i) => (
              <li key={b.id} className="sheet avoid-break p-4">
                <p className="stamp stamp-accent">
                  Belief {i + 1} · {b.domain}
                </p>
                <p className="mt-1 text-xl italic">&ldquo;{b.belief}&rdquo;</p>

                <div className="no-print mt-4 space-y-4">
                  <TextField label="Where did this come from?" value={b.source} onChange={(v) => patch(b.id, "source", v)} multiline rows={2} hint="When did you first decide this, and who was in the room?" />
                  {testQuestions.map((q) => (
                    <TextField key={q.id} label={q.label} hint={q.hint} value={b[q.id]} onChange={(v) => patch(b.id, q.id, v)} multiline rows={2} testId={`belief-${i}-${q.id}`} />
                  ))}
                  <TextField
                    label="The opposite belief" value={b.opposite} onChange={(v) => patch(b.id, "opposite", v)} multiline rows={2} testId={`belief-${i}-opposite`}
                    hint="Not a slogan. Something modest and true that puts you in charge: “I can learn this, one habit at a time.”"
                  />
                  <button type="button" className="min-h-11 text-base underline" onClick={() => setBeliefs((list) => list.filter((x) => x.id !== b.id))}>
                    Remove this belief
                  </button>
                </div>

                <dl className="print-only mt-3 text-base">
                  {[["Where it came from", b.source], ...testQuestions.map((q) => [q.label, b[q.id]] as [string, string]), ["The opposite belief", b.opposite]].map(([k, v]) => (
                    <div key={k} className="border-t border-rule-soft py-2">
                      <dt className="stamp">{k}</dt>
                      <dd className="min-h-8 whitespace-pre-line">{v}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-8">
        <PrintButton label="Print the worksheet" />
      </div>
    </>
  );
}
