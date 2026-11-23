import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Progress", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Progress" phase="Phase 4" />;
}
