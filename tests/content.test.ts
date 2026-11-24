import { describe, expect, it } from "vitest";
import { frontmatterSchema, getLessons, MAX_WORDS, parseLesson } from "@/lib/content";
import { quizItems, itemsForUnit } from "@/content/quizzes";
import { decks } from "@/content/decks";
import { answerCard } from "@/lib/flashcards";
import { nextLesson } from "@/lib/progress";
import { units, weeks } from "@/content/course";
import fs from "node:fs";
import { shuffled } from "@/lib/shuffle";

const good = `---
id: "2.1"
title: Significance
unit: 2
week: 3
summary: A summary that is long enough to pass validation.
---
Body text.`;

describe("lesson frontmatter", () => {
  it("accepts a well-formed lesson", () => {
    expect(parseLesson("x", good).title).toBe("Significance");
  });
  it.each([
    ["missing title", good.replace("title: Significance\n", "")],
    ["misspelled key", good.replace("summary:", "sumary:")],
    ["unknown extra key", good.replace("week: 3", "week: 3\nauthor: me")],
    ["week out of range", good.replace("week: 3", "week: 9")],
    ["id from another unit", good.replace('"2.1"', '"3.1"')],
    ["malformed id", good.replace('"2.1"', '"two"')],
  ])("fails the build on %s", (_n, src) => {
    expect(() => parseLesson("x", src)).toThrow(/content\/lessons\/x\.mdx/);
  });
  it("fails the build when a lesson runs past the word limit", () => {
    expect(() => parseLesson("x", good + " word".repeat(MAX_WORDS + 5))).toThrow(/limit/);
  });
  it("rejects unknown keys at the schema level", () => {
    expect(frontmatterSchema.safeParse({ id: "1.1", title: "abc", unit: 1, week: 1, summary: "x".repeat(30), extra: 1 }).success).toBe(false);
  });
});

describe("lessons on disk", () => {
  const lessons = getLessons();
  it("are all under the 10-minute limit and open with a hook, not a heading", () => {
    for (const l of lessons) {
      expect(l.words, l.slug).toBeLessThanOrEqual(MAX_WORDS);
      expect(l.words, l.slug).toBeGreaterThan(250);
      const first = l.body.trim().split("\n")[0] ?? "";
      expect(first.startsWith("#") || first.startsWith("<"), `${l.slug} should open with a story paragraph`).toBe(false);
    }
  });
  it("avoid filler words", () => {
    for (const l of lessons) expect(l.body, l.slug).not.toMatch(/\b(delve|robust|moreover|tapestry|leverag(e|ing))\b/i);
  });
});

describe("course structure matches the syllabus", () => {
  const lessons = getLessons();
  const ids = lessons.map((l) => l.id);
  it("has every lesson named in the build spec", () => {
    const required = [
      "1.1", "1.2", "1.3", "1.4", "1.5",
      "2.0", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8",
      "3.0", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7",
      "4.0", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10",
      "5.1", "5.2", "5.3", "5.4",
    ];
    expect(ids).toEqual(required);
  });
  it("puts each lesson in the week the syllabus schedule gives", () => {
    const byWeek = (w: number) => lessons.filter((l) => l.week === w).map((l) => l.id);
    expect(byWeek(1)).toEqual(["1.1", "1.2"]);
    expect(byWeek(2)).toEqual(["1.3", "1.4", "1.5"]);
    expect(byWeek(3)).toEqual(["2.0", "2.1", "2.2", "2.3"]);
    expect(byWeek(4)).toEqual(["2.4", "2.5", "2.6", "2.7", "2.8"]);
    expect(byWeek(5)).toEqual(["3.0", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7"]);
    expect(byWeek(6)).toEqual(["4.0", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6"]);
    expect(byWeek(7)).toEqual(["4.7", "4.8", "4.9", "4.10"]);
    expect(byWeek(8)).toEqual(["5.1", "5.2", "5.3", "5.4"]);
  });
  it("keeps each week's deliverable word for word from the syllabus", () => {
    const syllabus = fs.readFileSync("docs/syllabus.md", "utf8");
    for (const w of weeks) expect(syllabus, `week ${w.number}`).toContain(`| ${w.deliverable} |`);
    for (const u of units) expect(u.weeks.every((n) => weeks.find((w) => w.number === n)?.unit === u.number)).toBe(true);
  });
  it("does not fill the missing source lesson 31 or port the sales pitch", () => {
    const all = lessons.map((l) => l.body).join("\n").toLowerCase();
    expect(all).not.toMatch(/lesson 31/);
    expect(all).not.toMatch(/enroll|sign up for|discount|next course|buy now|masterclass|certification program|advanced course/);
  });
});

describe("quizzes", () => {
  it("every item has a valid answer and an explanation", () => {
    const ids = new Set<string>();
    for (const q of quizItems) {
      expect(ids.has(q.id), q.id).toBe(false);
      ids.add(q.id);
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.options[q.answer], q.id).toBeDefined();
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.why.length, q.id).toBeGreaterThan(60);
    }
  });
  it.each([1, 2, 3, 4])("unit %i has at least 15 items including commonly-confused ones", (unit) => {
    const items = itemsForUnit(unit);
    expect(items.length).toBeGreaterThanOrEqual(15);
    expect(items.filter((q) => q.confused).length).toBeGreaterThanOrEqual(2);
  });
  it("covers the four named confusions", () => {
    const text = quizItems.filter((q) => q.confused).map((q) => `${q.prompt} ${q.options.join(" ")} ${q.why}`.toLowerCase()).join(" | ");
    for (const pair of [["acceptance", "approval"], ["deviance", "novelty"], ["social", "conformity"], ["significance", "recognition"]])
      expect(text.split(" | ").some((t) => pair.every((w) => t.includes(w))), pair.join(" vs ")).toBe(true);
  });
  it("spreads correct answers across positions", () => {
    for (const unit of [1, 2, 3, 4]) {
      const first = itemsForUnit(unit).filter((q) => q.answer === 0).length / itemsForUnit(unit).length;
      expect(first, `unit ${unit}`).toBeLessThan(0.55);
    }
  });
});

describe("flashcards", () => {
  it("has all five decks, each with cards", () => {
    expect(decks.map((d) => d.id).sort()).toEqual(["needs", "pillars", "stages", "values", "wounds"]);
    for (const d of decks) expect(d.cards.length, d.id).toBeGreaterThanOrEqual(10);
    expect(decks.find((d) => d.id === "needs")!.cards.length).toBeGreaterThanOrEqual(18);
  });
  it("'know' retires a card and 'again' brings it back a few cards later", () => {
    expect(answerCard([0, 1, 2, 3, 4], "know")).toEqual([1, 2, 3, 4]);
    expect(answerCard([0, 1, 2, 3, 4], "again")).toEqual([1, 2, 3, 0, 4]);
    expect(answerCard([0, 1], "again")).toEqual([1, 0]);
    expect(answerCard([0], "again")).toEqual([0]);
    expect(answerCard([], "know")).toEqual([]);
  });
});

describe("shuffling", () => {
  it("keeps every item and changes the order", () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const out = shuffled(items, random);
    expect([...out].sort((a, b) => a - b)).toEqual(items);
    expect(out).not.toEqual(items);
  });
});

describe("resume point", () => {
  const refs = [
    { slug: "a", id: "1.1", title: "A", week: 1, unit: 1 },
    { slug: "b", id: "1.2", title: "B", week: 1, unit: 1 },
  ];
  it("is the first lesson not yet complete", () => {
    expect(nextLesson(refs, { lessons: {}, deliverables: {} })?.slug).toBe("a");
    expect(nextLesson(refs, { lessons: { a: "x" }, deliverables: {} })?.slug).toBe("b");
    expect(nextLesson(refs, { lessons: { a: "x", b: "x" }, deliverables: {} })).toBeNull();
  });
});
