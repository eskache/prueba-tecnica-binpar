"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

const COLOR_CLASSES = {
  accent: "text-accent decoration-accent/50",
  mass: "text-mass decoration-mass/50",
  constant: "text-constant decoration-constant/50",
};

// Separación mínima entre el tooltip y el borde de la pantalla.
const VIEWPORT_MARGIN = 12;

type TermProps = {
  word: string;
  definition: string;
  color?: keyof typeof COLOR_CLASSES;
};

export default function Term({ word, definition, color = "accent" }: TermProps) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  // El tooltip se centra sobre la palabra. Si la palabra está cerca del borde,
  // se saldría de la pantalla, así que lo desplazamos lo justo para que quepa.
  // --tooltip-shift guarda ese desplazamiento; la flecha lo compensa para seguir
  // señalando la palabra.
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!open || !tooltip) return;

    tooltip.style.setProperty("--tooltip-shift", "0px");
    const { left, right } = tooltip.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;

    let shift = 0;
    if (left < VIEWPORT_MARGIN) {
      shift = VIEWPORT_MARGIN - left;
    } else if (right > viewportWidth - VIEWPORT_MARGIN) {
      shift = viewportWidth - VIEWPORT_MARGIN - right;
    }
    tooltip.style.setProperty("--tooltip-shift", `${shift}px`);
  }, [open]);

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
        className={`cursor-help font-semibold underline decoration-dotted underline-offset-4 ${COLOR_CLASSES[color]}`}
      >
        {word}
      </span>

      {/* Cerrado es "hidden" y no solo transparente: un tooltip invisible
          fuera de la pantalla haría igualmente que la página tuviera scroll horizontal. */}
      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        style={{ transform: "translateX(calc(-50% + var(--tooltip-shift, 0px)))" }}
        className={`pointer-events-none absolute left-1/2 bottom-full z-10 mb-2 w-64 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal text-foreground shadow-lg ${
          open ? "block motion-safe:animate-fade-in" : "hidden"
        }`}
      >
        {definition}
        <span
          style={{ left: "calc(50% - var(--tooltip-shift, 0px))" }}
          className="absolute top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-surface"
        />
      </span>
    </span>
  );
}
