import { needs, pillars, values } from "@/content/frameworks";

export const needOptions = needs.map((n) => ({ value: n.id, label: n.name }));
export const pillarOptions = pillars.map((p) => ({ value: p.id, label: p.name }));
export const valueOptions = values.map((v) => ({ value: v.id, label: v.name }));
export const weekOptions = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Week ${i + 1}` }));
export const trackOptions = [
  { value: "controlled", label: "Controlled (recorded)" },
  { value: "live", label: "Live (in person)" },
];
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
export { cap };

/** A whole number from 1 to 8, or null. Anything else in the address bar is ignored. */
export function parseWeek(raw: string | null): number | null {
  if (raw === null || !/^[1-8]$/.test(raw.trim())) return null;
  return Number(raw.trim());
}

