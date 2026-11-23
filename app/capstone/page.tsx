import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Capstone", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Capstone" phase="Phase 4" />;
}
