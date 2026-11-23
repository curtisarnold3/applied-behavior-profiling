import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader
        stamp="Error 404"
        title="This page isn't in the manual"
        lede="The link may be old, or the address may have a typo. Nothing's wrong with your progress."
      />
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to the course map
        </Link>
        <Link href="/practice" className="btn">
          Go drill instead
        </Link>
      </div>
    </>
  );
}
