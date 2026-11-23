import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/PageHeader";
import { CapstoneForm } from "@/components/CapstoneForm";
import { capstone } from "@/content/capstone";

export const metadata: Metadata = {
  title: "Capstone: three field profiles",
  description: "The capstone brief, the pass criteria, and a template for three field profiles you can print or export.",
};

export default function CapstonePage() {
  return (
    <>
      <PageHeader stamp="Capstone · due Week 8 · 30% of the grade" title="Three field profiles" lede={capstone.intro} />
      <Section id="brief" title="The brief">
        <p>For each person, submit:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          {capstone.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </Section>
      <Section id="pass" title="Pass criteria">
        <p className="sheet-soft border-l-4 border-l-accent p-4 text-lg" data-testid="pass-criteria">
          {capstone.pass}
        </p>
        <p className="hint no-print mt-3">
          Stuck on a read? The <Link href="/tools/profile-builder">profile builder</Link> walks through it, and{" "}
          <Link href="/lesson/common-mistakes">Common Mistakes</Link> covers the pairs that get confused.
        </p>
        <p className="mt-3 text-base">
          A reminder as you go into the field: profile to understand and to help. Use first names or labels only,
          and keep what you write private.
        </p>
      </Section>
      <Section id="template" title="Your three profiles">
        <CapstoneForm />
      </Section>
    </>
  );
}
