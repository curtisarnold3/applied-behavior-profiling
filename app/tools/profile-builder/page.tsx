import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProfileBuilder } from "@/components/ProfileBuilder";
import { ProfileSentence } from "@/components/diagrams/Frameworks";

export const metadata: Metadata = {
  title: "Profile builder",
  description: "Turn one quoted statement into a profile sentence: If I... then people will... so I can finally...",
};

export default function ProfileBuilderPage() {
  return (
    <>
      <PageHeader
        stamp="Tool · Week 7"
        title="Profile builder"
        lede="Start with one thing a person actually said. Five steps later you'll have a working profile in a single sentence."
      />
      <ProfileSentence />
      <ProfileBuilder />
      <p className="hint mt-6">A read is a hypothesis about this moment, not a verdict on a person. Use it to understand and to help.</p>
    </>
  );
}
