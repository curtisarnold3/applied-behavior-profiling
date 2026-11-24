"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizItem } from "@/content/quizzes/types";
import { shuffled } from "@/lib/shuffle";
import { useStored } from "@/lib/useStored";
import { StorageNotice } from "./StorageNotice";

/**
 * One question at a time. Pick an answer, read why, move on.
 * `scoreKey` saves the result (unit checks); leave it out for free practice.
 */
export function Quiz({ items, scoreKey, title }: { items: QuizItem[]; scoreKey?: string; title: string }) {
  const [scores, setScores] = useStored("quiz");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [started, setStarted] = useState(false);
  /** For each question, the order its options are shown in. Reshuffled on every run. */
  const [orders, setOrders] = useState<number[][]>([]);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = started && index >= items.length;
  const item = items[index];
  const saved = scoreKey ? scores[scoreKey] : undefined;

  useEffect(() => {
    if (picked !== null) feedbackRef.current?.focus();
  }, [picked]);
  useEffect(() => {
    if (started) headingRef.current?.focus();
  }, [index, started]);

  const restart = () => {
    setOrders(items.map((q) => shuffled(q.options.map((_, i) => i))));
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setStarted(true);
  };

  const choose = (i: number) => {
    if (picked !== null || !item) return;
    setPicked(i);
    if (i === item.answer) setCorrect((c) => c + 1);
  };

  const advance = () => {
    const last = index + 1 >= items.length;
    if (last && scoreKey) {
      setScores((s) => ({
        ...s,
        [scoreKey]: {
          best: Math.max(s[scoreKey]?.best ?? 0, correct),
          last: correct,
          total: items.length,
          date: new Date().toISOString(),
        },
      }));
    }
    setPicked(null);
    setIndex((i) => i + 1);
  };

  if (items.length === 0) return <p className="hint">Questions for this set are on their way.</p>;

  if (!started) {
    return (
      <div className="sheet p-4" data-testid="quiz">
        <StorageNotice />
        <p className="stamp stamp-accent">{title}</p>
        <p className="mt-2">
          {items.length} short scenarios. After each answer we&rsquo;ll see <em>why</em>, so wrong answers teach
          as much as right ones.
        </p>
        {saved ? (
          <p className="hint mt-2" data-testid="quiz-best">
            Best so far: {saved.best} of {saved.total}.
          </p>
        ) : null}
        <button type="button" className="btn btn-primary mt-4" onClick={restart}>
          {saved ? "Take it again" : "Start"}
        </button>
      </div>
    );
  }

  if (finished || !item) {
    const pct = Math.round((correct / items.length) * 100);
    return (
      <div className="sheet p-4" data-testid="quiz">
        <p className="stamp stamp-accent">{title} · result</p>
        <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl" data-testid="quiz-result">
          {correct} of {items.length} ({pct}%)
        </h3>
        <p className="mt-2">
          {pct >= 80
            ? "That's recognition starting to become automatic. The field is the next test."
            : "Misses are the useful part. Skim the lessons behind the ones that surprised you, then run it again."}
        </p>
        <button type="button" className="btn mt-4" onClick={restart}>
          Run it again
        </button>
      </div>
    );
  }

  const right = picked === item.answer;
  return (
    <div className="sheet p-4" data-testid="quiz">
      <p className="stamp">
        {title} · Question {index + 1} of {items.length}
        {item.confused ? " · commonly confused" : ""}
      </p>
      <h3 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-xl font-semibold leading-snug" data-testid="quiz-prompt">
        {item.prompt}
      </h3>
      <ul className="mt-4 space-y-2">
        {(orders[index] ?? item.options.map((_, i) => i)).map((i, position) => {
          const opt = item.options[i]!;
          const isAnswer = i === item.answer;
          const state = picked === null ? "" : isAnswer ? "border-olive bg-[#eef0e2]" : i === picked ? "border-accent-deep bg-[#f7e6dc]" : "opacity-70";
          return (
            <li key={opt}>
              <button
                type="button"
                onClick={() => choose(i)}
                aria-disabled={picked !== null}
                data-testid={`opt-${position}`}
                data-correct={picked !== null && isAnswer ? "true" : undefined}
                className={`flex min-h-12 w-full items-center gap-3 rounded-[3px] border-[1.5px] border-ink bg-card px-3 py-2 text-left ${state}`}
              >
                <span aria-hidden="true" className="font-mono text-sm font-semibold">
                  {String.fromCharCode(65 + position)}
                </span>
                <span className="flex-1">{opt}</span>
                {picked !== null && isAnswer ? <span className="stamp text-olive">✓ Correct answer</span> : null}
                {picked !== null && i === picked && !isAnswer ? <span className="stamp stamp-accent">✗ Your pick</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null ? (
        <div ref={feedbackRef} tabIndex={-1} role="status" className="mt-4 border-t-[1.5px] border-ink pt-3" data-testid="quiz-feedback">
          <p className="stamp">{right ? "✓ Right" : "✗ Not quite"} · why</p>
          <p className="mt-1">{item.why}</p>
          <button type="button" className="btn btn-primary mt-3" onClick={advance} data-testid="quiz-next">
            {index + 1 >= items.length ? "See result" : "Next question"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
