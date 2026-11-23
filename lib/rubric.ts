import { WEEKLY_LOG_TARGET } from "@/content/course";
import { HABIT_IDS, TRAIT_IDS, type Assessment, type Capstone, type CapstoneProfile, type LogEntry, type Milestone, type QuizScores } from "./schema";

/** Weeks whose practice-log entries count toward the 40%. */
export const LOG_WEEKS = [3, 4, 5, 6, 7] as const;
export const WEIGHTS = { logs: 40, checks: 20, capstone: 30, plan: 10 } as const;

export function logsScore(log: LogEntry[]): number {
  const got = LOG_WEEKS.reduce((sum, w) => sum + Math.min(WEEKLY_LOG_TARGET, log.filter((e) => e.week === w).length), 0);
  return got / (LOG_WEEKS.length * WEEKLY_LOG_TARGET);
}

/** Average of the best result on the Unit 1–3 checks. An untaken check counts as zero. */
export function checksScore(quiz: QuizScores): number {
  const units = ["unit-1", "unit-2", "unit-3"];
  return units.reduce((sum, u) => sum + (quiz[u] ? quiz[u].best / quiz[u].total : 0), 0) / units.length;
}

const filled = (s: string) => s.trim().length > 0;

/** Fraction of one capstone profile that's complete. Index 0 is the recorded interview. */
export function profileScore(p: CapstoneProfile, live: boolean): number {
  const parts: boolean[] = [
    filled(p.need) && filled(p.needPhrase),
    filled(p.pillar) && filled(p.pillarPhrase),
    filled(p.value) && filled(p.valuePhrase),
    filled(p.sentence),
    filled(p.alternative),
    p.evidenceOk,
  ];
  if (live) parts.push(filled(p.response), filled(p.reaction), filled(p.change), p.responseOk);
  return parts.filter(Boolean).length / parts.length;
}

export function capstoneScore(c: Capstone): number {
  return c.profiles.reduce((sum, p, i) => sum + profileScore(p, i > 0), 0) / c.profiles.length;
}

export function assessmentComplete(a: Assessment): boolean {
  return TRAIT_IDS.every((t) => typeof a.traits[t] === "number") && HABIT_IDS.every((h) => typeof a.habits[h] === "number");
}

/** Half for a fully scored self-assessment, half for at least two dated steps. */
export function planScore(a: Assessment, plan: Milestone[]): number {
  const dated = plan.filter((m) => filled(m.step) && m.due !== "").length;
  return (assessmentComplete(a) ? 0.5 : 0) + Math.min(2, dated) * 0.25;
}

export type Scorecard = { rows: { id: keyof typeof WEIGHTS; label: string; weight: number; fraction: number; points: number }[]; total: number };

export function scorecard(data: { log: LogEntry[]; quiz: QuizScores; capstone: Capstone; assessment: Assessment; plan: Milestone[] }): Scorecard {
  const fractions = {
    logs: logsScore(data.log),
    checks: checksScore(data.quiz),
    capstone: capstoneScore(data.capstone),
    plan: planScore(data.assessment, data.plan),
  };
  const labels = { logs: "Weekly practice logs", checks: "Unit checks (Units 1–3)", capstone: "Capstone", plan: "Self-development plan" };
  const rows = (Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).map((id) => ({
    id, label: labels[id], weight: WEIGHTS[id], fraction: fractions[id], points: Math.round(fractions[id] * WEIGHTS[id] * 10) / 10,
  }));
  return { rows, total: Math.round(rows.reduce((s, r) => s + r.points, 0)) };
}
