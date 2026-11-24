"use client";

import { useState } from "react";
import type { Deck } from "@/content/decks";
import type { Framework, QuizItem } from "@/content/quizzes/types";
import { shuffled } from "@/lib/shuffle";
import { Flashcards } from "./Flashcards";
import { Quiz } from "./Quiz";
import { StorageNotice } from "./StorageNotice";

const FILTERS: { id: Framework | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "foundations", label: "Foundations" },
  { id: "needs", label: "Needs" },
  { id: "pillars", label: "Pillars" },
  { id: "values", label: "Values" },
  { id: "integration", label: "Integration" },
];

export function PracticeHub({ decks, items }: { decks: Deck[]; items: QuizItem[] }) {
  const [filter, setFilter] = useState<Framework | "all">("all");
  const [active, setActive] = useState<{ kind: "deck" | "quiz"; id: string; order?: number[] } | null>(null);

  const shownDecks = decks.filter((d) => filter === "all" || d.framework === filter);
  const shownItems = items.filter((q) => filter === "all" || q.framework === filter);
  const confused = shownItems.filter((q) => q.confused);
  const deck = active?.kind === "deck" ? decks.find((d) => d.id === active.id) : undefined;
  const quizItems = active?.kind === "quiz" ? (active.id === "confused" ? confused : shownItems) : [];

  return (
    <div>
      <StorageNotice />
      <div role="group" aria-label="Filter by framework" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setActive(null);
            }}
            className={`btn btn-quiet ${filter === f.id ? "btn-active" : ""}`}
            data-testid={`filter-${f.id}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <h2 className="mt-8 border-t-[1.5px] border-ink pt-3 text-2xl">Flashcards</h2>
      {shownDecks.length === 0 ? (
        <p className="hint mt-3">No flashcard deck for this filter. Try the scenario quiz below.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {shownDecks.map((d) => (
            <li key={d.id} className="sheet-soft p-4">
              <h3 className="text-lg">{d.title}</h3>
              <p className="hint">
                {d.cards.length} cards · {d.blurb}
              </p>
              <button type="button" className="btn mt-3" onClick={() => setActive({ kind: "deck", id: d.id, order: shuffled(d.cards.map((_, i) => i)) })} data-testid={`deck-${d.id}`}>
                Drill<span className="sr-only"> {d.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {deck ? (
        <div className="mt-5">
          <Flashcards key={`${deck.id}-${active?.order?.join("")}`} deck={deck} order={active?.order} />
        </div>
      ) : null}

      <h2 className="mt-10 border-t-[1.5px] border-ink pt-3 text-2xl">Scenario quizzes</h2>
      {shownItems.length === 0 ? (
        <p className="hint mt-3">No scenarios for this filter yet.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={() => setActive({ kind: "quiz", id: "all" })} data-testid="quiz-all">
            All scenarios ({shownItems.length})
          </button>
          {confused.length > 0 ? (
            <button type="button" className="btn" onClick={() => setActive({ kind: "quiz", id: "confused" })} data-testid="quiz-confused">
              Commonly confused ({confused.length})
            </button>
          ) : null}
        </div>
      )}
      {active?.kind === "quiz" && quizItems.length > 0 ? (
        <div className="mt-5">
          <Quiz key={`${filter}-${active.id}`} items={quizItems} title={active.id === "confused" ? "Commonly confused" : "Scenario practice"} />
        </div>
      ) : null}
    </div>
  );
}
