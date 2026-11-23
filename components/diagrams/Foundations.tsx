import { stages, wounds } from "@/content/frameworks";
import { ACCENT, CARD, DEEP, Figure, INK, MONO, SOFT } from "./Figure";

export function StagesLadder() {
  const w = 68;
  return (
    <Figure
      title="The Five Stages of Perception"
      desc="A staircase of five steps rising from left to right. At each step we see other people differently: as broken, then different, then facts, then reasons, and at the top as reflections of ourselves."
      caption="Fig. The five stages: each step up changes what other people look like to us"
      viewBox="0 0 360 300"
      textVersion={
        <ol className="mt-1 list-decimal pl-5">
          {stages.map((s) => (
            <li key={s.n}>
              {s.name}: we see others as {s.sees.toLowerCase()}.
            </li>
          ))}
        </ol>
      }
    >
      <text x="10" y="20" fontSize="10.5" fontFamily={MONO} fontWeight="600" letterSpacing="1.4" fill={INK}>
        WE SEE OTHER PEOPLE AS...
      </text>
      {stages.map((s, i) => {
        const x = 10 + i * w;
        const top = 216 - i * 42;
        return (
          <g key={s.n}>
            <rect x={x} y={top} width={w} height={262 - top} fill={i === 4 ? DEEP : CARD} stroke={INK} strokeWidth="1.6" />
            <rect x={x} y={top} width={w} height="6" fill={i === 4 ? ACCENT : INK} />
            <text x={x + w / 2} y={top + 24} textAnchor="middle" fontSize="10" fontFamily={MONO} fontWeight="600" fill={SOFT}>
              STAGE {s.n}
            </text>
            <text x={x + w / 2} y={top + 41} textAnchor="middle" fontSize={s.sees.length > 9 ? 11 : 12.5} fontWeight="800" fill={INK}>
              {s.sees}
            </text>
          </g>
        );
      })}
      <line x1="10" y1="262" x2="350" y2="262" stroke={INK} strokeWidth="2" />
      <text x="10" y="284" fontSize="10.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif" fontStyle="italic">
        judging
      </text>
      <text x="350" y="284" textAnchor="end" fontSize="10.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif" fontStyle="italic">
        understanding
      </text>
      <line x1="58" y1="280" x2="268" y2="280" stroke={SOFT} strokeWidth="1" strokeDasharray="3 3" />
    </Figure>
  );
}

export function WoundTypes() {
  return (
    <Figure
      title="The Six Wound Types"
      desc="Six cards in a grid, one for each childhood wound and the loss behind it: social, loss of acceptance; authority, loss of control; emotional, abandonment or betrayal; security, loss of safety and stability; validation, loss of recognition; trust, fear of vulnerability."
      caption="Fig. The six wound types and the loss behind each"
      viewBox="0 0 360 250"
      textVersion={
        <ul className="mt-1 list-disc pl-5">
          {wounds.map((w) => (
            <li key={w.id}>
              {w.name} wound: {w.loss.toLowerCase()}.
            </li>
          ))}
        </ul>
      }
    >
      {wounds.map((w, i) => {
        const x = 6 + (i % 2) * 177;
        const y = 8 + Math.floor(i / 2) * 80;
        return (
          <g key={w.id}>
            <rect x={x} y={y} width="171" height="70" rx="3" fill={CARD} stroke={INK} strokeWidth="1.6" />
            <rect x={x} y={y} width="30" height="70" fill={DEEP} stroke={INK} strokeWidth="1.6" />
            <text x={x + 15} y={y + 41} textAnchor="middle" fontSize="15" fontFamily={MONO} fontWeight="600" fill={INK}>
              {i + 1}
            </text>
            <text x={x + 40} y={y + 30} fontSize="14" fontWeight="800" fill={INK}>
              {w.name}
            </text>
            <text x={x + 40} y={y + 48} fontSize="10.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif">
              {w.loss}
            </text>
          </g>
        );
      })}
    </Figure>
  );
}
