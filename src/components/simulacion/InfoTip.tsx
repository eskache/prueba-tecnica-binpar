"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type InfoTipProps = {
  /** El nombre del botón para lectores de pantalla. */
  label: string;
  /** El texto de ayuda. */
  children: ReactNode;
};

/** Un icono de interrogación que muestra un texto de ayuda: al pasar el ratón por
 * encima, al tocarlo o pulsarlo (queda abierto hasta pulsar fuera o Escape) y al enfocarlo
 * con el teclado. El texto se coloca bajo el elemento contenedor más cercano que tenga
 * `position: relative`, ocupando todo su ancho. */
export default function InfoTip({ label, children }: InfoTipProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();

  const isOpen = isPinned || isHovered;

  // Abierto con un clic o un toque, se cierra pulsando fuera o con Escape.
  useEffect(() => {
    if (!isPinned) return;

    function closeOnPressOutside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsPinned(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsPinned(false);
    }

    document.addEventListener("pointerdown", closeOnPressOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPressOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isPinned]);

  return (
    <span ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsPinned(!isPinned)}
        // Solo el ratón abre al pasar por encima: al tocar en una pantalla táctil, el
        // clic ya lo abre y lo cierra, sin que el "hover" que simula el navegador estorbe.
        onPointerEnter={(event) => event.pointerType === "mouse" && setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        aria-label={label}
        aria-expanded={isOpen}
        aria-describedby={tipId}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-medium text-muted transition-colors hover:border-accent/60 hover:text-foreground"
      >
        ?
      </button>

      <span
        id={tipId}
        role="tooltip"
        className={`absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-border bg-surface p-3 text-xs normal-case leading-relaxed tracking-normal text-foreground ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {children}
      </span>
    </span>
  );
}
