import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { getLessonMetas } from "@/lib/content";

export const metadata: Metadata = {
  title: "Progress",
  description: "Your course dashboard, private scorecard, and data controls: export, import, and reset.",
};

export default function ProgressPage() {
  const lessons = getLessonMetas().map(({ slug, id, title, week, unit }) => ({ slug, id, title, week, unit }));
  return (
    <>
      <PageHeader stamp="Dashboard" title="Progress" lede="Where you are, how the practice is adding up, and full control of your data." />
      <ProgressDashboard lessons={lessons} />
    </>
  );
}
