import { NeedsMap } from "./diagrams/NeedsMap";

/** The one diagram that sums up each unit, shown on its landing page. */
export function UnitDiagram({ unit }: { unit: number }) {
  if (unit === 2) return <NeedsMap />;
  return null;
}
