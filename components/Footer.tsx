import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/field-cards", label: "Field cards" },
  { href: "/capstone", label: "Capstone" },
  { href: "/credits", label: "Credits and works cited" },
];

export function Footer() {
  return (
    <footer className="no-print border-t-[1.5px] border-ink bg-card">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="stamp">{site.course}</p>
        <p className="mt-1 text-base">
          {site.name}. An 8-week field course by {site.author}.
        </p>
        <p className="hint mt-2">{site.ethics}</p>
        <ul className="-mx-2 mt-3 flex flex-wrap">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="flex min-h-11 items-center px-2 text-base">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="hint mt-3">
          No accounts, no tracking. Your progress stays in this browser; export it any time from{" "}
          <Link href="/progress">Progress</Link>.
        </p>
      </div>
    </footer>
  );
}
