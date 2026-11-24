import { CARD, DEEP, Figure, INK, MONO, SOFT } from "./Figure";

const rings = [
  { n: 4, name: "OUTER", who: "strangers", r: 168, fill: CARD },
  { n: 3, name: "PROXIMITY", who: "coworkers, acquaintances", r: 128, fill: "#f3ecdd" },
  { n: 2, name: "LEGACY", who: "long-time friends", r: 88, fill: DEEP },
  { n: 1, name: "INNER", who: "partners, mentors", r: 48, fill: "#dccfb4" },
];

export function FourCircles() {
  const c = 180;
  return (
    <Figure
      title="The Four Needs Circles"
      desc="Four concentric circles around a person. From the center outward: the inner circle of partners, mentors and very close family; the legacy circle of long-time friends; the proximity circle of coworkers and acquaintances; and the outer circle of strangers."
      caption="Fig. The Four Needs Circles: the same person can show a different need in each ring"
      viewBox="0 0 360 360"
      maxWidth={440}
      textVersion={
        <ol className="mt-1 list-decimal pl-5">
          <li>Inner circle: partners, mentors, very close family. Raw needs live here.</li>
          <li>Legacy circle: long-time friends, our tribe.</li>
          <li>Proximity circle: coworkers and acquaintances. Friendly, not close.</li>
          <li>Outer circle: strangers, and how we want to look to them.</li>
        </ol>
      }
    >
      {rings.map((ring) => (
        <circle key={ring.n} cx={c} cy={c} r={ring.r} fill={ring.fill} stroke={INK} strokeWidth={ring.n === 1 ? 2 : 1.3} />
      ))}
      {rings.map((ring) => {
        const top = ring.n === 1 ? c - 10 : c - ring.r + 17;
        const bottom = ring.n === 1 ? c + 12 : c + ring.r - 20;
        return (
          <g key={ring.n}>
            <text x={c} y={top} textAnchor="middle" fontSize="11.5" fontFamily={MONO} fontWeight="600" letterSpacing="1" fill={INK}>
              {ring.n} · {ring.name}
            </text>
            <text x={c} y={bottom} textAnchor="middle" fontSize={ring.n === 1 ? 11 : 12} fill={SOFT} fontFamily="var(--font-body), Georgia, serif" fontStyle="italic">
              {ring.who}
            </text>
          </g>
        );
      })}
    </Figure>
  );
}
