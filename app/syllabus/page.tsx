import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Syllabus", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Syllabus" phase="Phase 3" />;
}
