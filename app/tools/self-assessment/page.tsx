import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SelfAssessment } from "@/components/SelfAssessment";
import { SOURCE_CREDIT } from "@/content/assessment";

export const metadata: Metadata = {
  title: "Authority self-assessment",
  description: "Rate five traits and five habit areas, find your lowest, and build a dated milestone plan.",
};

export default function SelfAssessmentPage() {
  return (
    <>
      <PageHeader
        stamp="Tool · Week 8"
        title="Authority self-assessment"
        lede="Ten honest ratings, about ten minutes. Nobody sees this but you."
      />
      <p className="text-base" data-testid="inventory-credit">
        {SOURCE_CREDIT.before}
        <em>{SOURCE_CREDIT.title}</em>
        {SOURCE_CREDIT.after} Full citation on the <Link href="/credits">Credits page</Link>.
      </p>
      <p className="no-print mt-3">
        New here? Read <Link href="/lesson/authority-self-assessment">Rating Our Own Authority</Link> first.
      </p>
      <div className="mt-8">
        <SelfAssessment />
      </div>
    </>
  );
}
