"use client";

import { useId, type ReactNode } from "react";

export function TextField({
  label, value, onChange, hint, multiline = false, type = "text", required = false, testId, rows,
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; multiline?: boolean;
  type?: "text" | "date"; required?: boolean; testId?: string; rows?: number;
}) {
  const id = useId();
  const common = {
    id, value, required, "data-testid": testId, className: "field",
    "aria-describedby": hint ? `${id}-h` : undefined,
  };
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {multiline ? (
        <textarea {...common} rows={rows ?? 3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? (
        <p id={`${id}-h`} className="hint mt-1">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label, value, onChange, options, hint, testId, placeholder = "Not sure yet",
}: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
  hint?: string; testId?: string; placeholder?: string | null;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field" data-testid={testId} aria-describedby={hint ? `${id}-h` : undefined}>
        {placeholder !== null ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={`${id}-h`} className="hint mt-1">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** A pick-one list of large tappable cards, built on native radio inputs. */
export function ChoiceCards({
  legend, name, value, onChange, options, hint,
}: {
  legend: string; name: string; value: string; onChange: (v: string) => void;
  options: { value: string; title: string; detail: ReactNode }[]; hint?: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      {hint ? <div className="hint mb-2">{hint}</div> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer gap-3 rounded-[3px] border-[1.5px] p-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy ${checked ? "border-ink bg-paper-deep" : "border-rule bg-card"}`}
            >
              <input
                type="radio" name={name} value={o.value} checked={checked}
                onChange={() => onChange(o.value)}
                className="mt-1 h-6 w-6 shrink-0 accent-[#b93c0a]"
                data-testid={`${name}-${o.value}`}
              />
              <span className="min-w-0">
                <span className="block font-display font-bold">
                  {o.title}
                  {checked ? <span className="stamp ml-2">selected</span> : null}
                </span>
                <span className="block text-[0.95rem] leading-snug text-ink-soft">{o.detail}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Status({ children }: { children: ReactNode }) {
  return (
    <p role="status" aria-live="polite" className="hint mt-2 min-h-6" data-testid="status">
      {children}
    </p>
  );
}
