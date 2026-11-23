import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { LimitingBeliefs } from "@/components/LimitingBeliefs";

export const metadata: Metadata = {
  title: "Limiting-beliefs worksheet",
  description: "List the beliefs holding you back, run each through four test questions, and write its opposite.",
};

export default function LimitingBeliefsPage() {
  return (
    <>
      <PageHeader
        stamp="Tool · Week 8"
        title="Limiting-beliefs worksheet"
        lede="A belief is a conclusion we reached once and stopped checking. This is where we check."
      />
      <p>
        Two ground rules. Don&rsquo;t go on a witch hunt; let beliefs surface on their own. And don&rsquo;t just
        notice them: test them. The background is in the lesson{" "}
        <Link href="/lesson/limiting-beliefs">Limiting Beliefs</Link>.
      </p>
      <div className="mt-8">
        <LimitingBeliefs />
      </div>
    </>
  );
}
