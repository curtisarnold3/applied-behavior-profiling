"use client";

import { useState } from "react";
import { capstone } from "@/content/capstone";
import { profileSentence } from "@/content/frameworks";
import { downloadFile, today } from "@/lib/download";
import { cap, needOptions, pillarOptions, valueOptions } from "@/lib/options";
import { profileScore } from "@/lib/rubric";
import { CURRENT_VERSION, type CapstoneProfile } from "@/lib/schema";
import { useStored } from "@/lib/useStored";
import { SelectField, Status, TextField } from "./forms";
import { PrintButton } from "./PrintButton";
import { StorageNotice } from "./StorageNotice";

export function CapstoneForm() {
  const [data, setData, ready] = useStored("capstone");
  const [status, setStatus] = useState("");

  const patch = (i: number, change: Partial<CapstoneProfile>) =>
    setData((d) => ({ profiles: d.profiles.map((p, j) => (j === i ? { ...p, ...change } : p)) }));

  const exportJson = () =>
    setStatus(
      downloadFile(`capstone-${today()}.json`, "application/json", JSON.stringify({ app: "abp", version: CURRENT_VERSION, exportedAt: new Date().toISOString(), data: { capstone: data } }, null, 2))
        ? "Capstone exported." : "The download was blocked by the browser.",
    );

  return (
    <>
      <StorageNotice />
      <div className="space-y-8">
        {data.profiles.map((p, i) => {
          const live = i > 0;
          const pct = ready ? Math.round(profileScore(p, live) * 100) : 0;
          return (
            <section key={i} className="sheet avoid-break p-4" aria-labelledby={`cap-${i}`} data-testid={`capstone-${i}`}>
              <p className="stamp stamp-accent">
                Profile {i + 1} of 3 · {capstone.slots[i]}
              </p>
              <h2 id={`cap-${i}`} className="mt-1 text-xl">
                {p.who.trim() || capstone.slots[i]}
              </h2>
              <p className="stamp mt-1" aria-live="polite">
                {pct}% complete
              </p>

              <div className="no-print mt-4 space-y-4">
                <TextField label="Who (a first name or a label is enough)" value={p.who} onChange={(v) => patch(i, { who: v })} hint={live ? "A live conversation." : "The interview: who, and where it can be found."} testId={`cap-${i}-who`} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Likely need" value={p.need} onChange={(v) => patch(i, { need: v as CapstoneProfile["need"] })} options={needOptions} testId={`cap-${i}-need`} />
                  <TextField label="The exact phrase that showed it" value={p.needPhrase} onChange={(v) => patch(i, { needPhrase: v })} testId={`cap-${i}-needPhrase`} />
                  <SelectField label="Likely decision pillar" value={p.pillar} onChange={(v) => patch(i, { pillar: v as CapstoneProfile["pillar"] })} options={pillarOptions} />
                  <TextField label="The exact phrase that showed it" value={p.pillarPhrase} onChange={(v) => patch(i, { pillarPhrase: v })} />
                  <SelectField label="Likely value" value={p.value} onChange={(v) => patch(i, { value: v as CapstoneProfile["value"] })} options={valueOptions} />
                  <TextField label="The exact phrase that showed it" value={p.valuePhrase} onChange={(v) => patch(i, { valuePhrase: v })} />
                </div>
                <TextField label="Profile sentence" value={p.sentence} onChange={(v) => patch(i, { sentence: v })} multiline rows={2} hint="If I... then people will... so I can finally..." testId={`cap-${i}-sentence`} />
                <button type="button" className="btn btn-quiet" onClick={() => patch(i, { sentence: profileSentence(p) })}>
                  Draft it from my picks
                </button>
                <TextField label="One alternative read, and why I ruled it out" value={p.alternative} onChange={(v) => patch(i, { alternative: v })} multiline rows={2} />
                {live ? (
                  <>
                    <TextField label="What I said in response" value={p.response} onChange={(v) => patch(i, { response: v })} multiline rows={2} />
                    <TextField label="How they reacted" value={p.reaction} onChange={(v) => patch(i, { reaction: v })} multiline rows={2} />
                    <TextField label="What I'd change next time" value={p.change} onChange={(v) => patch(i, { change: v })} multiline rows={2} />
                  </>
                ) : null}
                <fieldset className="border-t border-rule pt-3">
                  <legend className="field-label">Pass check (be honest)</legend>
                  <label className="flex min-h-11 items-start gap-3 py-1">
                    <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#b93c0a]" checked={p.evidenceOk} onChange={(e) => patch(i, { evidenceOk: e.target.checked })} />
                    <span>The evidence phrases actually support the read.</span>
                  </label>
                  {live ? (
                    <label className="flex min-h-11 items-start gap-3 py-1">
                      <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#b93c0a]" checked={p.responseOk} onChange={(e) => patch(i, { responseOk: e.target.checked })} />
                      <span>My response matched the need I identified.</span>
                    </label>
                  ) : null}
                </fieldset>
              </div>

              <dl className="print-only mt-3 text-base">
                {(
                  [
                    ["Need", `${cap(p.need)}${p.needPhrase ? ` — “${p.needPhrase}”` : ""}`],
                    ["Decision pillar", `${cap(p.pillar)}${p.pillarPhrase ? ` — “${p.pillarPhrase}”` : ""}`],
                    ["Value", `${cap(p.value)}${p.valuePhrase ? ` — “${p.valuePhrase}”` : ""}`],
                    ["Profile sentence", p.sentence],
                    ["Alternative read ruled out", p.alternative],
                    ...(live ? [["What I said", p.response], ["How they reacted", p.reaction], ["What I'd change", p.change]] : []),
                    ["Pass check", `${p.evidenceOk ? "✓" : "☐"} Evidence supports the read${live ? `   ${p.responseOk ? "✓" : "☐"} Response matched the need` : ""}`],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} className="border-t border-rule-soft py-2">
                    <dt className="stamp">{k}</dt>
                    <dd className="min-h-7 whitespace-pre-line">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
      <div className="no-print mt-8 flex flex-wrap gap-3">
        <PrintButton label="Print the capstone" />
        <button type="button" className="btn" onClick={exportJson} data-testid="capstone-export">
          Export as JSON
        </button>
      </div>
      <Status>{status}</Status>
    </>
  );
}
