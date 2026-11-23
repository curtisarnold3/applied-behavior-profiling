import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Limiting beliefs", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Limiting beliefs" phase="Phase 4" />;
}
