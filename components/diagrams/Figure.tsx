import { useId, type ReactNode } from "react";

/**
 * Every diagram goes through this wrapper so it always carries:
 *  - an accessible name and description on the SVG (role="img"),
 *  - a visible caption, and
 *  - a plain-text version anyone can open.
 */
export function Figure({
  title,
  desc,
  caption,
  viewBox,
  maxWidth = 520,
  textVersion,
  children,
}: {
  title: string;
  desc: string;
  caption: string;
  viewBox: string;
  maxWidth?: number;
  textVersion: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <figure className="sheet-soft avoid-break my-7 p-3 sm:p-4" data-diagram={title}>
      <svg
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        viewBox={viewBox}
        className="mx-auto block h-auto w-full"
        style={{ maxWidth }}
        fontFamily="var(--font-head), Arial, sans-serif"
      >
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{desc}</desc>
        {children}
      </svg>
      <figcaption className="stamp mt-3 border-t border-rule-soft pt-2">{caption}</figcaption>
      <details className="no-print mt-1 text-base">
        <summary className="hint flex min-h-11 cursor-pointer items-center underline">Read this diagram as text</summary>
        <div className="pb-2 text-[0.95rem] leading-snug">{textVersion}</div>
      </details>
    </figure>
  );
}

export const INK = "#1c1a17";
export const SOFT = "#4b463e";
export const PAPER = "#f5f0e6";
export const DEEP = "#e9e1cf";
export const CARD = "#fbf8f1";
export const ACCENT = "#b93c0a";
export const ACCENT_DEEP = "#8f2d06";
export const OLIVE = "#4f5a2a";
export const NAVY = "#2c4766";
export const MONO = "var(--font-label), ui-monospace, monospace";
