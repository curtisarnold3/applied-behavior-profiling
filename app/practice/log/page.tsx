import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Practice log", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Practice log" phase="Phase 4" />;
}
