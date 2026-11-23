import type { QuizItem } from "./types";
import { unit1 } from "./unit-1";
import { unit2 } from "./unit-2";
import { unit3 } from "./unit-3";

export const quizItems: QuizItem[] = [...unit1, ...unit2, ...unit3];

export const itemsForUnit = (unit: number) => quizItems.filter((q) => q.unit === unit);
export type { QuizItem, Framework } from "./types";
