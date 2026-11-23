import { needs } from "@/content/frameworks";
import { ACCENT, CARD, DEEP, Figure, INK, MONO, SOFT } from "./Figure";

const short: Record<string, [string, string?]> = {
  significance: ["seen as", "exceptional"],
  acceptance: ["to belong"],
  approval: ["judged good", "and kind"],
  intelligence: ["seen as", "smart"],
  pity: ["hardship", "believed"],
  strength: ["respect"],
};

export function NeedsMap() {
  const primary = needs.filter((n) => n.tier === "primary");
  const secondary = needs.filter((n) => n.tier === "secondary");
  const xs = [8, 128, 248];
  const hub = { x: 180, y: 208 };

  const box = (n: (typeof needs)[number], x: number, y: number, isPrimary: boolean) => {
    const lines = short[n.id] ?? [""];
    return (
      <g key={n.id}>
        <line x1={x + 52} y1={isPrimary ? y + 62 : y} x2={hub.x} y2={hub.y} stroke={INK} strokeWidth="1.2" strokeDasharray={isPrimary ? undefined : "4 3"} />
        <rect x={x} y={y} width="104" height="62" rx="3" fill={CARD} stroke={INK} strokeWidth={isPrimary ? 2 : 1.4} strokeDasharray={isPrimary ? undefined : "5 3"} />
        {isPrimary ? <rect x={x} y={y} width="104" height="7" fill={ACCENT} /> : null}
        <text x={x + 52} y={y + 27} textAnchor="middle" fontSize="13.5" fontWeight="800" fill={INK}>
          {n.name}
        </text>
        {lines.map((l, i) => (
          <text key={i} x={x + 52} y={y + 42 + i * 12} textAnchor="middle" fontSize="10.5" fill={SOFT} fontFamily="var(--font-body), Georgia, serif">
            {l}
          </text>
        ))}
      </g>
    );
  };

  return (
    <Figure
      title="The Human Needs Map"
      desc="Six social needs arranged around one person. Three primary needs, significance, acceptance and approval, sit above with solid outlines. Three secondary needs, intelligence, pity and strength, sit below with dashed outlines."
      caption="Fig. The Human Needs Map: three primary needs (solid), three secondary (dashed)"
      viewBox="0 0 360 416"
      textVersion={
        <>
          <p className="mt-1">
            <strong>Primary needs:</strong>
          </p>
          <ul className="list-disc pl-5">
            {primary.map((n) => (
              <li key={n.id}>
                {n.name}: {n.craves.toLowerCase()}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            <strong>Secondary needs:</strong>
          </p>
          <ul className="list-disc pl-5">
            {secondary.map((n) => (
              <li key={n.id}>
                {n.name}: {n.craves.toLowerCase()}
              </li>
            ))}
          </ul>
        </>
      }
    >
      <text x="8" y="22" fontSize="10.5" fontFamily={MONO} fontWeight="600" letterSpacing="1.5" fill={INK}>
        PRIMARY
      </text>
      <text x="8" y="408" fontSize="10.5" fontFamily={MONO} fontWeight="600" letterSpacing="1.5" fill={INK}>
        SECONDARY
      </text>
      {primary.map((n, i) => box(n, xs[i] ?? 0, 34, true))}
      {secondary.map((n, i) => box(n, xs[i] ?? 0, 326, false))}
      <circle cx={hub.x} cy={hub.y} r="50" fill={DEEP} stroke={INK} strokeWidth="2" />
      <text x={hub.x} y={hub.y - 12} textAnchor="middle" fontSize="10" fontFamily={MONO} fontWeight="600" letterSpacing="1" fill={INK}>
        RIGHT NOW,
      </text>
      <text x={hub.x} y={hub.y + 4} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK}>
        what do they
      </text>
      <text x={hub.x} y={hub.y + 19} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK}>
        want from us?
      </text>
    </Figure>
  );
}
