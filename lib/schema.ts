import { z } from "zod";

// Zod normally probes for `new Function` support, which trips the site's content-security policy.
// Jitless mode skips the probe; validation behaves the same.
z.config({ jitless: true });

export const NEED_IDS = ["significance", "acceptance", "approval", "intelligence", "pity", "strength"] as const;
export const PILLAR_IDS = ["deviance", "novelty", "social", "conformity", "investment", "necessity"] as const;
export const VALUE_IDS = ["connection", "information", "recognition", "experiences", "freedom", "growth"] as const;
export const TRAIT_IDS = ["confidence", "discipline", "leadership", "gratitude", "enjoyment"] as const;
export const HABIT_IDS = ["environment", "time", "appearance", "social", "financial"] as const;

export const TEXT_MAX = 4000;
export const SHORT_MAX = 400;
/** Over-long text is trimmed to fit, never rejected: one long note must not cost the learner their data. */
const text = z.string().transform((s) => s.slice(0, TEXT_MAX));
const short = z.string().transform((s) => s.slice(0, SHORT_MAX));
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isoDate = z.string().regex(ISO_DATE, "expected YYYY-MM-DD");
const level = z.number().int().min(1).max(5);

export const progressSchema = z.object({
  lessons: z.record(z.string().max(80), z.string().max(40)),
  deliverables: z.record(z.string().max(80), z.boolean()),
});
export type Progress = z.infer<typeof progressSchema>;

export const logEntrySchema = z.object({
  id: z.string().min(1).max(60),
  date: isoDate,
  week: z.number().int().min(1).max(8),
  track: z.enum(["controlled", "live"]),
  context: short,
  phrase: text,
  need: z.enum(NEED_IDS).or(z.literal("")),
  pillar: z.enum(PILLAR_IDS).or(z.literal("")),
  value: z.enum(VALUE_IDS).or(z.literal("")),
  response: text,
  reaction: text,
  notes: text,
});
export type LogEntry = z.infer<typeof logEntrySchema>;
export const logSchema = z.array(logEntrySchema).max(5000);

export const quizSchema = z.record(
  z.string().max(40),
  z
    .object({ best: z.number().int().min(0), last: z.number().int().min(0), total: z.number().int().min(1).max(500), date: z.string().max(40) })
    .refine((q) => q.best <= q.total && q.last <= q.total, "score cannot exceed the number of questions"),
);
export type QuizScores = z.infer<typeof quizSchema>;

export const assessmentSchema = z.object({
  traits: z.partialRecord(z.enum(TRAIT_IDS), level),
  habits: z.partialRecord(z.enum(HABIT_IDS), level),
  date: z.string().max(40),
});
export type Assessment = z.infer<typeof assessmentSchema>;

export const milestoneSchema = z.object({
  id: z.string().min(1).max(60),
  focus: short,
  step: text,
  due: isoDate.or(z.literal("")),
  done: z.boolean(),
});
export type Milestone = z.infer<typeof milestoneSchema>;
export const planSchema = z.array(milestoneSchema).max(200);

export const beliefSchema = z.object({
  id: z.string().min(1).max(60),
  belief: text,
  domain: short,
  source: text,
  exception: text,
  helping: text,
  inCharge: text,
  coach: text,
  opposite: text,
});
export type Belief = z.infer<typeof beliefSchema>;
export const beliefsSchema = z.array(beliefSchema).max(200);

export const capstoneProfileSchema = z.object({
  who: short,
  need: z.enum(NEED_IDS).or(z.literal("")),
  needPhrase: text,
  pillar: z.enum(PILLAR_IDS).or(z.literal("")),
  pillarPhrase: text,
  value: z.enum(VALUE_IDS).or(z.literal("")),
  valuePhrase: text,
  sentence: text,
  alternative: text,
  response: text,
  reaction: text,
  change: text,
  evidenceOk: z.boolean(),
  responseOk: z.boolean(),
});
export type CapstoneProfile = z.infer<typeof capstoneProfileSchema>;
export const capstoneSchema = z.object({ profiles: z.array(capstoneProfileSchema).length(3) });
export type Capstone = z.infer<typeof capstoneSchema>;

/** Every stored key, its schema, and its empty value. One place to add a new key. */
export const STORE = {
  progress: { schema: progressSchema, empty: { lessons: {}, deliverables: {} } as Progress },
  log: { schema: logSchema, item: logEntrySchema, empty: [] as LogEntry[] },
  quiz: { schema: quizSchema, empty: {} as QuizScores },
  assessment: { schema: assessmentSchema, empty: { traits: {}, habits: {}, date: "" } as Assessment },
  plan: { schema: planSchema, item: milestoneSchema, empty: [] as Milestone[] },
  beliefs: { schema: beliefsSchema, item: beliefSchema, empty: [] as Belief[] },
  capstone: {
    schema: capstoneSchema,
    empty: { profiles: [emptyProfile(), emptyProfile(), emptyProfile()] } as Capstone,
  },
} as const;

export type StoreKey = keyof typeof STORE;
export type StoreValue<K extends StoreKey> = (typeof STORE)[K]["empty"];
export const STORE_KEYS = Object.keys(STORE) as StoreKey[];

export function emptyProfile(): CapstoneProfile {
  return {
    who: "", need: "", needPhrase: "", pillar: "", pillarPhrase: "", value: "", valuePhrase: "",
    sentence: "", alternative: "", response: "", reaction: "", change: "", evidenceOk: false, responseOk: false,
  };
}

export const CURRENT_VERSION = 1;

export const exportSchema = z.object({
  app: z.literal("abp"),
  version: z.number().int().min(0),
  exportedAt: z.string().max(40),
  data: z.record(z.string(), z.unknown()),
});
export type ExportFile = z.infer<typeof exportSchema>;
