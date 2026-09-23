"use client";

import { useId, useState } from "react";

type TermProps = {
  word: string;
  definition: string;
};

export default function Term({ word, definition }: TermProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className="relative inline-block">
      <span
        tabIndex={0}
        role="button"
        aria-describedby={tooltipId}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="cursor-help font-semibold text-accent underline decoration-accent/50 decoration-dotted underline-offset-4"
      >
        {word}
      </span>

      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 bottom-full z-10 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal text-foreground shadow-lg transition-opacity duration-150 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {definition}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-surface" />
      </span>
    </span>
  );
}
