"use client";

import { useState } from "react";
import type { Deck } from "@/content/decks";
import { answerCard } from "@/lib/flashcards";
import { shuffled } from "@/lib/shuffle";

/** `order` is the shuffled starting order of card indexes, chosen when the learner opens the deck. */
export function Flashcards({ deck, order }: { deck: Deck; order?: number[] }) {
  const [queue, setQueue] = useState<number[]>(order ?? deck.cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [again, setAgain] = useState(0);
  const card = queue[0] !== undefined ? deck.cards[queue[0]] : undefined;

  const answer = (result: "know" | "again") => {
    if (!flipped) return;
    if (result === "again") setAgain((n) => n + 1);
    setQueue((q) => answerCard(q, result));
    setFlipped(false);
  };
  const restart = () => {
    setQueue(shuffled(deck.cards.map((_, i) => i)));
    setFlipped(false);
    setAgain(0);
  };

  // Shortcuts work only while focus is inside the card, so they never hijack typing elsewhere.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === " " || e.key === "Enter") {
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      e.preventDefault();
      setFlipped((f) => !f);
    } else if (e.key === "1") answer("again");
    else if (e.key === "2") answer("know");
  };

  if (!card) {
    return (
      <div className="sheet p-4" data-testid="deck-done">
        <p className="stamp stamp-accent">{deck.title} · done</p>
        <p className="mt-2 text-lg">
          Deck cleared. {again === 0 ? "Not one repeat." : `${again} card${again === 1 ? "" : "s"} came back for another look.`}
        </p>
        <button type="button" className="btn btn-primary mt-3" onClick={restart}>
          Shuffle back in
        </button>
      </div>
    );
  }

  return (
    <div data-testid="flashcards">
      <p className="stamp" aria-live="polite">
        {deck.title} · {queue.length} card{queue.length === 1 ? "" : "s"} left
      </p>
      <div
        role="group"
        aria-label={`Flashcard. ${flipped ? "Answer side" : "Question side"}.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="sheet mt-2 flex min-h-56 flex-col p-4"
        data-testid="card"
      >
        <p className="stamp stamp-accent">{flipped ? "Answer" : "Question"}</p>
        <p className="mt-2 flex-1 text-xl leading-snug" aria-live="polite" data-testid="card-text">
          {flipped ? card.back : card.front}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {!flipped ? (
            <button type="button" className="btn btn-primary" onClick={() => setFlipped(true)} data-testid="flip">
              Flip card
            </button>
          ) : (
            <>
              <button type="button" className="btn" onClick={() => answer("again")} data-testid="again">
                Again
              </button>
              <button type="button" className="btn btn-primary" onClick={() => answer("know")} data-testid="know">
                Know it
              </button>
            </>
          )}
        </div>
      </div>
      <p className="hint mt-2">
        Keyboard, with the card focused: <kbd>Space</kbd> flips, <kbd>1</kbd> again, <kbd>2</kbd> know it.
      </p>
    </div>
  );
}
