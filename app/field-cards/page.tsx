import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FieldCards } from "@/components/FieldCards";

export const metadata: Metadata = {
  title: "Field cards",
  description: "Printable pocket cards for the six needs, six decision pillars, six values, and the profile sentence.",
};

export default function FieldCardsPage() {
  return (
    <>
      <div className="no-print">
        <PageHeader
          stamp="Print and carry"
          title="Field cards"
          lede="Four cards, each sized to fit half a US Letter sheet. Fold one into a notebook or a jacket pocket."
        />
      </div>
      <FieldCards />
    </>
  );
}
