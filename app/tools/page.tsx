import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "Every practice tool in the course: drills, the practice log, the profile builder, and more.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader stamp="The kit" title="Tools" lede="Lessons explain. These are where the skill actually gets built." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <li key={t.href} className="sheet-soft p-4">
            <h2 className="text-lg">
              <Link href={t.href}>{t.title}</Link>
            </h2>
            <p className="hint mt-1">{t.blurb}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
