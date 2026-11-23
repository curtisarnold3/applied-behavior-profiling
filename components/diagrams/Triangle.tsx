import type { ReactNode } from "react";
import { ACCENT, CARD, DEEP, Figure, INK, MONO, SOFT } from "./Figure";

export type Corner = { label: string; note: [string, string?] };

/**
 * Shared three-corner drawing: labelled plates at the corners of a thin-line
 * triangle with a hub in the middle. `arrows` adds direction top → right → left.
 */
export function Triangle({
  title, desc, caption, corners, hub, arrows = false, textVersion,
}: {
  title: string;
  desc: string;
  caption: string;
  corners: [Corner, Corner, Corner];
  hub: [string, string?];
  arrows?: boolean;
  textVersion: ReactNode;
}) {
  const pts = [
    { x: 180, y: 52 },
    { x: 292, y: 262 },
    { x: 68, y: 262 },
  ] as const;
  const plate = (c: Corner, i: number) => {
    const p = pts[i]!;
    const w = 124;
    const x = Math.max(4, Math.min(360 - w - 4, p.x - w / 2));
    const y = p.y - 30;
    return (
      <g key={c.label}>
        <rect x={x} y={y} width={w} height="60" rx="3" fill={CARD} stroke={INK} strokeWidth="2" />
        <rect x={x} y={y} width="7" height="60" fill={ACCENT} />
        <text x={x + w / 2 + 3} y={y + 22} textAnchor="middle" fontSize="13.5" fontWeight="800" fill={INK}>
          {c.label}
        </text>
        {c.note.map((n, j) =>
          n ? (
            <text key={j} x={x + w / 2 + 3} y={y + 37 + j * 12} textAnchor="middle" fontSize="10" fill={SOFT} fontFamily="var(--font-body), Georgia, serif">
              {n}
            </text>
          ) : null,
        )}
      </g>
    );
  };
  return (
    <Figure title={title} desc={desc} caption={caption} viewBox="0 0 360 304" textVersion={textVersion}>
      {arrows ? (
        <defs>
          <marker id={`arrow-${title.replace(/\W/g, "")}`} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 z" fill={INK} />
          </marker>
        </defs>
      ) : null}
      {pts.map((p, i) => {
        const q = pts[(i + 1) % 3]!;
        // Shorten each edge so arrowheads stop at the plates.
        const t0 = i === 1 ? 0.3 : 0.24;
        const t1 = i === 1 ? 0.69 : 0.76;
        return (
          <line
            key={i}
            x1={p.x + (q.x - p.x) * t0} y1={p.y + (q.y - p.y) * t0}
            x2={p.x + (q.x - p.x) * t1} y2={p.y + (q.y - p.y) * t1}
            stroke={INK} strokeWidth="1.6"
            strokeDasharray={arrows ? undefined : "2 4"} strokeLinecap="round"
            markerEnd={arrows ? `url(#arrow-${title.replace(/\W/g, "")})` : undefined}
          />
        );
      })}
      <circle cx="180" cy="188" r="38" fill={DEEP} stroke={INK} strokeWidth="1.5" />
      {hub.map((h, i) =>
        h ? (
          <text key={i} x="180" y={(hub[1] ? 185 : 192) + i * 13} textAnchor="middle" fontSize="9.5" fontFamily={MONO} fontWeight="600" letterSpacing="1" fill={INK}>
            {h}
          </text>
        ) : null,
      )}
      {corners.map(plate)}
    </Figure>
  );
}
