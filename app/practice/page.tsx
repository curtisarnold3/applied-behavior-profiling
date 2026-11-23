import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PracticeHub } from "@/components/PracticeHub";
import { decks } from "@/content/decks";
import { quizItems } from "@/content/quizzes";

export const metadata: Metadata = {
  title: "Practice drills",
  description: "Flashcards and scenario quizzes for the needs, decision pillars, values, wounds, and stages.",
};

export default function PracticePage() {
  return (
    <>
      <PageHeader
        stamp="Drill hub"
        title="Practice"
        lede="Recognition gets automatic through reps, not rereading. Pick a framework and drill."
      />
      <PracticeHub decks={decks} items={quizItems} />
      <p className="mt-10 border-t border-rule pt-4">
        Heard something in the wild? <Link href="/practice/log">Add it to the practice log →</Link>
      </p>
    </>
  );
}
