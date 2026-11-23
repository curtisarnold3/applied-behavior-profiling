"use client";

import Link from "next/link";
import type { Deliverable } from "@/content/course";
import { WEEKLY_LOG_TARGET } from "@/content/course";
import { useStored } from "@/lib/useStored";
import { StorageNotice } from "./StorageNotice";

export function WeekChecklist({ week, items }: { week: number; items: Deliverable[] }) {
  const [progress, setProgress, ready] = useStored("progress");
  const [log] = useStored("log");
  const count = ready ? log.filter((e) => e.week === week).length : 0;

  return (
    <div className="sheet p-4">
      <StorageNotice />
      <ul className="space-y-1">
        {items.map((item) => {
          const checked = ready && Boolean(progress.deliverables[item.id]);
          return (
            <li key={item.id} className="flex items-start gap-3">
              <input
                id={item.id}
                type="checkbox"
                className="mt-3 h-6 w-6 shrink-0 accent-[#b93c0a]"
                checked={checked}
                onChange={(e) =>
                  setProgress((p) => ({ ...p, deliverables: { ...p.deliverables, [item.id]: e.target.checked } }))
                }
              />
              <span className="min-w-0 flex-1 py-2">
                <label htmlFor={item.id} className={checked ? "line-through decoration-1" : ""}>
                  {item.label}
                </label>
                {item.href ? (
                  <>
                    {" "}
                    <Link href={item.href} className="whitespace-nowrap">
                      Open →
                    </Link>
                  </>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="hint mt-3 border-t border-rule-soft pt-3" data-testid="week-log-count">
        Practice log this week: {count} of {WEEKLY_LOG_TARGET} entries. <Link href={`/practice/log?week=${week}`}>Open the log</Link>
      </p>
    </div>
  );
}
