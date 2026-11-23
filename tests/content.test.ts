import { describe, expect, it } from "vitest";
import { frontmatterSchema, getLessons, MAX_WORDS, parseLesson } from "@/lib/content";
import { quizItems, itemsForUnit } from "@/content/quizzes";
import { decks } from "@/content/decks";
import { answerCard } from "@/lib/flashcards";
import { nextLesson } from "@/lib/progress";

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
  it("unit 2 has at least 15 items including commonly-confused ones", () => {
    const items = itemsForUnit(2);
    expect(items.length).toBeGreaterThanOrEqual(15);
    expect(items.filter((q) => q.confused).length).toBeGreaterThanOrEqual(2);
  });
});

describe("flashcards", () => {
  it("has a needs deck with a card for every need", () => {
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
