import { pillars, values } from "@/content/frameworks";
import { ACCENT, ACCENT_DEEP, CARD, DEEP, Figure, INK, MONO, SOFT } from "./Figure";

export function DecisionPillars() {
  const w = 46, gap = 10, x0 = 17;
  return (
    <Figure
      title="The Six Decision Pillars"
      desc="A building front with six columns holding up a roof labelled how they decide. The columns are deviance, novelty, social, conformity, investment and necessity."
      caption="Fig. The six decision pillars: six ways of holding up a choice"
      viewBox="0 0 360 300"
      textVersion={
        <ul className="mt-1 list-disc pl-5">
          {pillars.map((p) => (
            <li key={p.id}>
              {p.name}: {p.decides.charAt(0).toLowerCase() + p.decides.slice(1)}.
            </li>
          ))}
        </ul>
      }
    >
      <path d="M8 74 L180 12 L352 74 Z" fill={DEEP} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <text x="180" y="58" textAnchor="middle" fontSize="11" fontFamily={MONO} fontWeight="600" letterSpacing="1.6" fill={INK}>
        HOW THEY DECIDE
      </text>
      <rect x="8" y="74" width="344" height="12" fill={CARD} stroke={INK} strokeWidth="2" />
      {pillars.map((p, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={p.id}>
            <rect x={x} y="86" width={w} height="176" fill={CARD} stroke={INK} strokeWidth="1.6" />
            <rect x={x} y="86" width={w} height="7" fill={ACCENT} />
            <line x1={x + 9} y1="100" x2={x + 9} y2="256" stroke={DEEP} strokeWidth="3" />
            <line x1={x + w - 9} y1="100" x2={x + w - 9} y2="256" stroke={DEEP} strokeWidth="3" />
            <text transform={`translate(${x + w / 2 + 5} 176) rotate(-90)`} textAnchor="middle" fontSize="14.5" fontWeight="800" fill={INK}>
              {p.name}
            </text>
          </g>
        );
      })}
      <rect x="8" y="262" width="344" height="12" fill={CARD} stroke={INK} strokeWidth="2" />
      <text x="180" y="292" textAnchor="middle" fontSize="10.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif" fontStyle="italic">
        the same idea, framed six ways
      </text>
    </Figure>
  );
}

const goalShort: Record<string, string> = {
  connection: "closeness",
  information: "being prepared",
  recognition: "being seen",
  experiences: "a life that's felt",
  freedom: "options",
  growth: "becoming more",
};

export function ValuesDiagram() {
  const c = 180, R = 122;
  return (
    <Figure
      title="The Six Values"
      desc="Six values arranged in a ring around the words end goal: connection, information, recognition, experiences, freedom and growth. Each is the deeper thing a person keeps pursuing."
      caption="Fig. The six values: the end goal a person keeps working toward"
      viewBox="0 0 360 360"
      maxWidth={460}
      textVersion={
        <ul className="mt-1 list-disc pl-5">
          {values.map((v) => (
            <li key={v.id}>
              {v.name}: {v.goal.toLowerCase()}.
            </li>
          ))}
        </ul>
      }
    >
      <circle cx={c} cy={c} r={R} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="2 5" />
      <circle cx={c} cy={c} r="44" fill={DEEP} stroke={INK} strokeWidth="2" />
      <text x={c} y={c - 4} textAnchor="middle" fontSize="10" fontFamily={MONO} fontWeight="600" letterSpacing="1.2" fill={INK}>
        SO I CAN
      </text>
      <text x={c} y={c + 12} textAnchor="middle" fontSize="13" fontWeight="800" fill={ACCENT_DEEP}>
        finally...
      </text>
      {values.map((v, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const x = c + R * Math.cos(a);
        const y = c + R * Math.sin(a);
        return (
          <g key={v.id}>
            <circle cx={x} cy={y} r="47" fill={CARD} stroke={INK} strokeWidth="1.8" />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK}>
              {v.name}
            </text>
            <text x={x} y={y + 13} textAnchor="middle" fontSize="9.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif">
              {goalShort[v.id]}
            </text>
          </g>
        );
      })}
    </Figure>
  );
}

export function ProfileSentence() {
  const rows = [
    { lead: "If I", slot: "DECISION PILLAR", cue: "Justifications", tip: "what they explain or defend" },
    { lead: "then people will", slot: "NEED", cue: "Repetitions", tip: "what they keep trying to get" },
    { lead: "so I can finally", slot: "VALUE", cue: "Adjectives", tip: "what they admire in others" },
  ];
  return (
    <Figure
      title="The profile sentence"
      desc="Three linked boxes, read top to bottom, that assemble one sentence. If I, followed by a decision pillar, heard in justifications. Then people will, followed by a need, heard in repetitions. So I can finally, followed by a value, heard in adjectives."
      caption="Fig. The profile sentence: decision, then need, then value"
      viewBox="0 0 360 318"
      textVersion={
        <ol className="mt-1 list-decimal pl-5">
          <li>&ldquo;If I...&rdquo; is the decision pillar. Listen for justifications.</li>
          <li>&ldquo;...then people will...&rdquo; is the need. Listen for repetitions.</li>
          <li>&ldquo;...so I can finally...&rdquo; is the value. Listen for adjectives.</li>
        </ol>
      }
    >
      {rows.map((r, i) => {
        const y = 8 + i * 106;
        return (
          <g key={r.slot}>
            <rect x="6" y={y} width="348" height="84" rx="3" fill={CARD} stroke={INK} strokeWidth="1.8" />
            <rect x="6" y={y} width="7" height="84" fill={ACCENT} />
            <text x="24" y={y + 28} fontSize="15" fontWeight="800" fill={INK}>
              {r.lead}
            </text>
            <rect x="24" y={y + 40} width="150" height="30" rx="2" fill={DEEP} stroke={INK} strokeWidth="1.2" strokeDasharray="4 3" />
            <text x="99" y={y + 59} textAnchor="middle" fontSize="10.5" fontFamily={MONO} fontWeight="600" letterSpacing="1.2" fill={INK}>
              {r.slot}
            </text>
            <text x="342" y={y + 24} textAnchor="end" fontSize="9.5" fontFamily={MONO} fontWeight="600" letterSpacing="1" fill={SOFT}>
              LISTEN FOR
            </text>
            <text x="342" y={y + 44} textAnchor="end" fontSize="14" fontWeight="800" fill={ACCENT_DEEP}>
              {r.cue}
            </text>
            <text x="342" y={y + 62} textAnchor="end" fontSize="10.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif" fontStyle="italic">
              {r.tip}
            </text>
            {i < 2 ? <path d={`M180 ${y + 86} v14 m-5 -6 l5 6 l5 -6`} fill="none" stroke={INK} strokeWidth="1.8" /> : null}
          </g>
        );
      })}
    </Figure>
  );
}
