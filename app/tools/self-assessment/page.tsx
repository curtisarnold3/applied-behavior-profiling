import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Self-assessment", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Self-assessment" phase="Phase 4" />;
}
