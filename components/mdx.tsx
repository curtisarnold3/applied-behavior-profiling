import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { needById } from "@/content/frameworks";
import { NeedsMap } from "./diagrams/NeedsMap";
import { FourCircles } from "./diagrams/FourCircles";
import { AuthorityTriangle, ChildhoodTriangle, SuccessTriangle } from "./diagrams/Triangles";
import { StagesLadder, WoundTypes } from "./diagrams/Foundations";
import { DecisionPillars, ProfileSentence, ValuesDiagram } from "./diagrams/Frameworks";
import { pillarById, valueById } from "@/content/frameworks";

/** A boxed aside. `label` is the small stamped heading, e.g. "Field rule". */
export function Callout({ label = "Field note", children }: { label?: string; children: ReactNode }) {
  return (
    <aside className="sheet-soft avoid-break my-6 border-l-4 border-l-accent px-4 py-3">
      <p className="stamp stamp-accent">{label}</p>
      <div className="mt-1 [&>*+*]:mt-2">{children}</div>
    </aside>
  );
}

/** A list of things people actually say. Children are plain list items. */
export function Phrases({ label = "Listen for", children }: { label?: string; children: ReactNode }) {
  return (
    <div className="avoid-break my-6 border-y-[1.5px] border-ink py-3">
      <p className="stamp">{label}</p>
      <div className="mt-2 font-serif italic [&_li+li]:mt-1.5 [&_ul]:list-none [&_ul]:pl-0">{children}</div>
    </div>
  );
}

/** The four-line summary card at the end of each need lesson. */
export function NeedGlance({ id }: { id: string }) {
  const need = needById(id);
  if (!need) throw new Error(`<NeedGlance id="${id}" />: no such need`);
  const rows = [
    ["They crave", need.craves],
    ["They fear", need.fear],
    ["Language that lands", need.language],
    ["Try saying", need.say],
    ["Superpower", need.superpower],
  ];
  return (
    <div className="sheet avoid-break my-7 p-4">
      <p className="stamp stamp-accent">
        At a glance · {need.tier} need
      </p>
      <p className="mt-1 font-display text-xl font-extrabold">{need.name}</p>
      <dl className="mt-2 text-base leading-snug">
        {rows.map(([k, v]) => (
          <div key={k} className="border-t border-rule-soft py-2">
            <dt className="stamp">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Glance({ kind, name, rows }: { kind: string; name: string; rows: [string, string][] }) {
  return (
    <div className="sheet avoid-break my-7 p-4">
      <p className="stamp stamp-accent">At a glance · {kind}</p>
      <p className="mt-1 font-display text-xl font-extrabold">{name}</p>
      <dl className="mt-2 text-base leading-snug">
        {rows.map(([k, v]) => (
          <div key={k} className="border-t border-rule-soft py-2">
            <dt className="stamp">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Summary card at the end of each decision-pillar lesson. */
export function PillarGlance({ id }: { id: string }) {
  const p = pillarById(id);
  if (!p) throw new Error(`<PillarGlance id="${id}" />: no such pillar`);
  return (
    <Glance
      kind="decision pillar"
      name={p.name}
      rows={[["They decide", p.decides], ["We hear", p.hear], ["Frame it as", p.frame], ["Avoid", p.avoid]]}
    />
  );
}

/** Summary card at the end of each value lesson. */
export function ValueGlance({ id }: { id: string }) {
  const v = valueById(id);
  if (!v) throw new Error(`<ValueGlance id="${id}" />: no such value`);
  return (
    <Glance
      kind="value"
      name={v.name}
      rows={[["End goal", v.goal], ["We notice", v.notice], ["We hear", v.hear], ["How to move them", v.move]]}
    />
  );
}

function A({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Table (scrolls sideways on small screens)">
      <table {...props} />
    </div>
  );
}

/** Everything a lesson file may use. Add new diagrams here. */
export const mdxComponents = {
  a: A,
  table: Table,
  Callout,
  Phrases,
  NeedGlance,
  NeedsMap,
  FourCircles,
  StagesLadder,
  WoundTypes,
  SuccessTriangle,
  ChildhoodTriangle,
  AuthorityTriangle,
  DecisionPillars,
  ValuesDiagram,
  ProfileSentence,
  PillarGlance,
  ValueGlance,
};
