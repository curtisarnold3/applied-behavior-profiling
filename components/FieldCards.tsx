"use client";

import { useState } from "react";
import { groundRules } from "@/content/course";
import { listeningCues, needs, pillars, values } from "@/content/frameworks";
import { site } from "@/lib/site";

function Card({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <article className="field-card" data-testid="field-card">
      <p className="stamp stamp-accent">{kicker}</p>
      <h2 className="mt-1">{title}</h2>
      <div className="mt-2">{children}</div>
      <p className="card-foot stamp mt-2 border-t border-ink pt-1">
        {site.shortName} · words outweigh what we see · read the moment
      </p>
    </article>
  );
}

function Rows({ rows }: { rows: { name: string; pairs: [string, string][] }[] }) {
  return (
    <div>
      {rows.map((r) => (
        <div key={r.name} className="row">
          <p className="row-name">{r.name}</p>
          <dl>
            {r.pairs.map(([k, v]) => (
              <div key={k}>
                <dt>{k} </dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function FieldCards() {
  const [layout, setLayout] = useState<"pocket" | "letter">("pocket");
  return (
    <div className={layout === "pocket" ? "cards-pocket" : "cards-letter"} data-testid="cards" data-layout={layout}>
      <div className="no-print sheet mb-6 p-4">
        <fieldset>
          <legend className="field-label">Paper</legend>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <label className="flex min-h-11 items-center gap-3">
              <input type="radio" name="layout" className="h-5 w-5 accent-[#b93c0a]" checked={layout === "pocket"} onChange={() => setLayout("pocket")} data-testid="layout-pocket" />
              <span>Pocket: half-letter, one card per sheet</span>
            </label>
            <label className="flex min-h-11 items-center gap-3">
              <input type="radio" name="layout" className="h-5 w-5 accent-[#b93c0a]" checked={layout === "letter"} onChange={() => setLayout("letter")} data-testid="layout-letter" />
              <span>US Letter: two cards per sheet, cut down the middle</span>
            </label>
          </div>
        </fieldset>
        <button type="button" className="btn btn-primary mt-3" onClick={() => window.print()}>
          Print the cards
        </button>
        <p className="hint mt-2">
          In the print dialog, set margins to &ldquo;None&rdquo; or &ldquo;Default&rdquo; and scale to 100%. The page
          size is set for you.
        </p>
      </div>

      <div className="card-grid grid gap-5 sm:grid-cols-2">
        <Card kicker="Field card 1 · Unit 2" title="The six needs">
          <p className="hint">What are they chasing from people, right now?</p>
          <Rows rows={needs.map((n) => ({ name: `${n.name}${n.tier === "primary" ? " ·" : ""}`, pairs: [["Hear", n.hear], ["Craves", n.craves], ["Say", n.language]] }))} />
          <p className="hint mt-1">· primary need. Identify, test, use, move on.</p>
        </Card>

        <Card kicker="Field card 2 · Unit 3" title="The six decision pillars">
          <p className="hint">How do they decide? Listen to the justification.</p>
          <Rows rows={pillars.map((p) => ({ name: p.name, pairs: [["Hear", p.hear], ["Decides", p.decides], ["Frame as", p.frame]] }))} />
        </Card>

        <Card kicker="Field card 3 · Unit 4" title="The six values">
          <p className="hint">What are they ultimately after? Listen to what they admire.</p>
          <Rows rows={values.map((v) => ({ name: v.name, pairs: [["End goal", v.goal], ["Notice", v.notice], ["Move them", v.move]] }))} />
        </Card>

        <Card kicker="Field card 4 · Week 7" title="The profile sentence">
          <p className="mt-1 border-l-4 border-accent pl-3 text-[1.05rem] leading-snug">
            <strong>If I</strong> [decision pillar], <strong>then people will</strong> [meet my need],{" "}
            <strong>so I can finally</strong> [value].
          </p>
          <Rows rows={listeningCues.map((c) => ({ name: `${c.cue} reveal ${c.reveals}`, pairs: [["Listen for", c.how]] }))} />
          <div className="row">
            <p className="row-name">Example</p>
            <dl>
              <div>
                <dt>Said </dt>
                <dd>&ldquo;I&rsquo;m the one everybody leans on.&rdquo;</dd>
              </div>
              <div>
                <dt>Sentence </dt>
                <dd>If I stay strong for everyone, then people will keep me close, so I can finally feel connected.</dd>
              </div>
            </dl>
          </div>
          <div className="row">
            <p className="row-name">Ground rules</p>
            <dl>
              {groundRules.map((g, i) => (
                <div key={g.title}>
                  <dt>{i + 1} </dt>
                  <dd>{g.title}</dd>
                </div>
              ))}
              <div>
                <dt>First </dt>
                <dd>Listen for why they felt the need to say it.</dd>
              </div>
              <div>
                <dt>Always </dt>
                <dd>Keep one alternative read. To understand and help, never to manipulate.</dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
    </div>
  );
}
