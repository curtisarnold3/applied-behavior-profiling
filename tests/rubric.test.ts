import { describe, expect, it } from "vitest";
import { assessmentComplete, capstoneScore, checksScore, logsScore, planScore, profileScore, scorecard } from "@/lib/rubric";
import { emptyProfile, STORE, type Assessment, type LogEntry } from "@/lib/schema";
import { habits, lowest, nextLevelGoal, traits, SOURCE_CREDIT, LEVEL_NAMES } from "@/content/assessment";
import { profileSentence } from "@/content/frameworks";

const entry = (week: number, i: number): LogEntry => ({
  id: `${week}-${i}`, date: "2026-11-23", week, track: "controlled", context: "", phrase: "x", need: "", pillar: "", value: "", response: "", reaction: "", notes: "",
});
const full: Assessment = {
  traits: { confidence: 3, discipline: 2, leadership: 4, gratitude: 2, enjoyment: 5 },
  habits: { environment: 3, time: 1, appearance: 4, social: 3, financial: 2 },
  date: "x",
};

describe("self-scoring rubric", () => {
  it("starts at zero with no data", () => {
    const card = scorecard({ log: [], quiz: {}, capstone: STORE.capstone.empty, assessment: STORE.assessment.empty, plan: [] });
    expect(card.total).toBe(0);
    expect(card.rows.map((r) => r.weight)).toEqual([40, 20, 30, 10]);
  });

  it("counts log entries in weeks 3-7, capped at 10 a week", () => {
    const log = [...Array.from({ length: 15 }, (_, i) => entry(3, i)), ...Array.from({ length: 5 }, (_, i) => entry(4, i)), entry(1, 0), entry(8, 0)];
    expect(logsScore(log)).toBeCloseTo(15 / 50);
  });

  it("averages the best unit 1-3 results and ignores unit 4", () => {
    const quiz = { "unit-1": { best: 20, last: 10, total: 20, date: "" }, "unit-2": { best: 9, last: 9, total: 18, date: "" }, "unit-4": { best: 20, last: 20, total: 20, date: "" } };
    expect(checksScore(quiz)).toBeCloseTo((1 + 0.5 + 0) / 3);
  });

  it("scores a capstone profile by completeness and honest pass checks", () => {
    const p = { ...emptyProfile(), need: "approval" as const, needPhrase: "I hope that's okay", evidenceOk: true };
    expect(profileScore(p, false)).toBeCloseTo(2 / 6);
    expect(profileScore(p, true)).toBeCloseTo(2 / 10);
    expect(capstoneScore(STORE.capstone.empty)).toBe(0);
  });

  it("gives half the plan score for the assessment and half for two dated steps", () => {
    const step = { id: "1", focus: "Time", step: "Write down promises", due: "2026-12-01", done: false };
    expect(assessmentComplete(full)).toBe(true);
    expect(planScore(full, [])).toBe(0.5);
    expect(planScore(full, [step])).toBe(0.75);
    expect(planScore(full, [step, { ...step, id: "2" }, { ...step, id: "3" }])).toBe(1);
    expect(planScore(STORE.assessment.empty, [{ ...step, due: "" }])).toBe(0);
  });

  it("reaches 100 with everything complete", () => {
    const done = { ...emptyProfile(), who: "A", need: "pity" as const, needPhrase: "a", pillar: "social" as const, pillarPhrase: "b", value: "growth" as const, valuePhrase: "c", sentence: "s", alternative: "alt", response: "r", reaction: "x", change: "y", evidenceOk: true, responseOk: true };
    const step = { id: "1", focus: "Time", step: "s", due: "2026-12-01", done: false };
    const q = { best: 18, last: 18, total: 18, date: "" };
    const card = scorecard({
      log: [3, 4, 5, 6, 7].flatMap((w) => Array.from({ length: 10 }, (_, i) => entry(w, i))),
      quiz: { "unit-1": q, "unit-2": q, "unit-3": q }, capstone: { profiles: [done, done, done] }, assessment: full, plan: [step, { ...step, id: "2" }],
    });
    expect(card.total).toBe(100);
  });
});

describe("self-assessment", () => {
  it("uses the five trait names and five habit areas, five levels each", () => {
    expect(traits.map((t) => t.name)).toEqual(["Confidence", "Discipline", "Leadership", "Gratitude", "Enjoyment"]);
    expect(habits.map((h) => h.name)).toEqual(["Environment", "Time", "Appearance", "Social", "Financial"]);
    for (const s of [...traits, ...habits]) expect(s.levels).toHaveLength(5);
    expect(LEVEL_NAMES).toHaveLength(5);
  });
  it("highlights the lowest trait and area, including ties", () => {
    expect(lowest(traits, full.traits).map((r) => r.scale.id)).toEqual(["discipline", "gratitude"]);
    expect(lowest(habits, full.habits).map((r) => r.scale.id)).toEqual(["time"]);
    expect(lowest(traits, {})).toEqual([]);
  });
  it("sets the goal one level above the rating", () => {
    const [low] = lowest(habits, full.habits);
    expect(nextLevelGoal(low!)).toEqual({ level: 2, text: habits[1]!.levels[1] });
    expect(nextLevelGoal({ scale: traits[0]!, level: 5 }).level).toBe(5);
  });
  it("credits the source model by its title", () => {
    expect(SOURCE_CREDIT.title).toBe("The Hughes Authority Behavior Inventory");
  });
});

describe("profile sentence", () => {
  it("assembles decision, need, and value in order", () => {
    expect(profileSentence({ pillar: "necessity", need: "significance", value: "connection" })).toBe(
      "If I handle what has to be done, then people will see that I matter, so I can finally feel connected.",
    );
    expect(profileSentence({})).toBe("If I [decision pillar], then people will [meet my need], so I can finally [value].");
  });
});
