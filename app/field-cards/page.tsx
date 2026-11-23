import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Field cards", robots: { index: false } };

export default function Page() {
  return <ComingSoon title="Field cards" phase="Phase 4" />;
}
