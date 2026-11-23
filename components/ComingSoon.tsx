import Link from "next/link";
import { PageHeader } from "./PageHeader";

/** Placeholder for a page that a later build phase fills in. */
export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <>
      <PageHeader stamp="Being built" title={title} lede={`This page arrives in ${phase} of the build.`} />
      <Link href="/" className="btn">
        Back to the course map
      </Link>
    </>
  );
}
