import { NeedsMap } from "./diagrams/NeedsMap";
import { StagesLadder } from "./diagrams/Foundations";
import { DecisionPillars, ProfileSentence } from "./diagrams/Frameworks";
import { AuthorityTriangle } from "./diagrams/Triangles";

/** The one diagram that sums up each unit, shown on its landing page. */
export function UnitDiagram({ unit }: { unit: number }) {
  if (unit === 1) return <StagesLadder />;
  if (unit === 2) return <NeedsMap />;
  if (unit === 3) return <DecisionPillars />;
  if (unit === 4) return <ProfileSentence />;
  if (unit === 5) return <AuthorityTriangle />;
  return null;
}
