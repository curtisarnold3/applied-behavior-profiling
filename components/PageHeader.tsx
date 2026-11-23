import type { ReactNode } from "react";

export function PageHeader({ stamp, title, lede }: { stamp: string; title: string; lede?: ReactNode }) {
  return (
    <div className="mb-8">
      <p className="stamp stamp-accent">{stamp}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      {lede ? <p className="mt-3 text-lg text-ink-soft">{lede}</p> : null}
    </div>
  );
}

export function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10" aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className="border-t-[1.5px] border-ink pt-3 text-2xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
