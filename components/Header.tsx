import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/#map", label: "Weeks" },
  { href: "/practice", label: "Practice" },
  { href: "/tools", label: "Tools" },
  { href: "/progress", label: "Progress" },
];

export function Header() {
  return (
    <header className="no-print border-b-[1.5px] border-ink bg-card">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center font-display text-lg font-extrabold tracking-tight text-ink no-underline"
        >
          <span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded-full bg-accent" />
          {site.shortName}
        </Link>
        <nav aria-label="Main">
          <ul className="-mx-2 flex flex-wrap">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="stamp flex min-h-11 items-center px-2 text-ink no-underline hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
