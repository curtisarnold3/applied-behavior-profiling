export type Framework = "foundations" | "needs" | "pillars" | "values" | "integration";

export type QuizItem = {
  id: string;
  unit: 1 | 2 | 3 | 4;
  framework: Framework;
  /** The scenario or question. */
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Shown after answering: explains why, not just what. */
  why: string;
  /** True for the "commonly confused" pairs. */
  confused?: boolean;
};
