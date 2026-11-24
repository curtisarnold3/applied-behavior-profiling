import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PracticeLog } from "@/components/PracticeLog";
import { getLessonMetas } from "@/lib/content";

export const metadata: Metadata = {
  title: "Practice log",
  description: "Log what you hear on the controlled and live tracks, count toward 10 a week, and export to CSV or JSON.",
};

export default function LogPage() {
  const lessons = getLessonMetas().map(({ slug, id, title, week, unit }) => ({ slug, id, title, week, unit }));
  return (
    <>
      <PageHeader
        stamp="Practice log"
        title="What did you hear?"
        lede="Two tracks: controlled (interviews, podcasts, TV) and live (real conversations). Ten entries a week, each with the exact phrase."
      />
      <PracticeLog lessons={lessons} />
      <p className="no-print mt-10 border-t border-rule pt-4">
        Want help turning a quote into a full read? <Link href="/tools/profile-builder">Use the profile builder →</Link>
      </p>
    </>
  );
}
