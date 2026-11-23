import type { QuizItem } from "./types";
import { unit2 } from "./unit-2";

export const quizItems: QuizItem[] = [...unit2];

export const itemsForUnit = (unit: number) => quizItems.filter((q) => q.unit === unit);
export type { QuizItem, Framework } from "./types";
