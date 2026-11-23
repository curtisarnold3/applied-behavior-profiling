import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getWorksCited, parseInline } from "@/lib/worksCited";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Credits and works cited",
  description: "Where the frameworks taught in this course come from, cited in MLA format.",
};

export default function CreditsPage() {
  const { intro, entries } = getWorksCited();
  return (
    <>
      <PageHeader
        stamp="Credits"
        title="Credits and works cited"
        lede={`This course was written and built by ${site.author}. The frameworks it teaches are someone else's, and they're credited here.`}
      />
      <p>{intro}</p>
      <h2 className="mt-8 border-t-[1.5px] border-ink pt-3 text-2xl">Works cited</h2>
      <ul className="mt-4 space-y-4" data-testid="works-cited">
        {entries.map((entry) => (
          <li key={entry} className="pl-8 -indent-8">
            {parseInline(entry).map((part, i) =>
              part.kind === "em" ? (
                <em key={i}>{part.text}</em>
              ) : part.kind === "url" ? (
                <a key={i} href={part.text} className="break-all">
                  {part.text}
                </a>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 border-t-[1.5px] border-ink pt-3 text-2xl">About this site</h2>
      <p className="mt-4">
        All lesson text, diagrams, quizzes, and tools on this site are original work written for this course.
        Typefaces are Source Serif 4, Archivo, and IBM Plex Mono, each used under the SIL Open Font License.
      </p>
    </>
  );
}
