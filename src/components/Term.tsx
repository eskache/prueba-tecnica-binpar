"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { TONE_DECORATION, TONE_TEXT, type Tone } from "@/lib/tones";

type TermProps = {
  word: string;
  definition: string;
  tone?: Tone;
};

const VIEWPORT_MARGIN = 12;

/**
 * Palabra con definición. Se abre con hover o foco (ratón y teclado) y también
 * con clic/toque, que la deja fijada: en pantallas táctiles no existe hover, y
 * ahí el toque es la única forma de verla. Escape o pulsar fuera la cierra.
 */
export default function Term({ word, definition, tone = "mass" }: TermProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const open = hovered || focused || pinned;

  useEffect(() => {
    if (!open) return;

    function dismiss() {
      setHovered(false);
      setFocused(false);
      setPinned(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) dismiss();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // El tooltip se centra sobre la palabra, pero una palabra cerca del borde
  // haría que se saliera de la pantalla (y en móvil, que aparezca scroll
  // horizontal). Se desplaza lo justo para caber; la flecha sigue señalando a
  // la palabra gracias a la misma variable.
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!open || !tooltip) return;

    tooltip.style.setProperty("--tt-shift", "0px");
    const rect = tooltip.getBoundingClientRect();
    const overflowLeft = VIEWPORT_MARGIN - rect.left;
    const overflowRight =
      rect.right - (document.documentElement.clientWidth - VIEWPORT_MARGIN);

    let shift = 0;
    if (overflowLeft > 0) shift = overflowLeft;
    else if (overflowRight > 0) shift = -overflowRight;
    tooltip.style.setProperty("--tt-shift", `${shift}px`);
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setPinned((value) => !value)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`cursor-help font-semibold underline decoration-dotted underline-offset-4 ${TONE_TEXT[tone]} ${TONE_DECORATION[tone]}`}
      >
        {word}
      </button>

      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        style={{ transform: "translateX(calc(-50% + var(--tt-shift, 0px)))" }}
        className={`pointer-events-none absolute left-1/2 bottom-full z-10 mb-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm font-normal leading-normal text-foreground shadow-lg transition-opacity duration-150 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {definition}
        <span
          style={{ left: "calc(50% - var(--tt-shift, 0px))" }}
          className="absolute top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-surface"
        />
      </span>
    </span>
  );
}
