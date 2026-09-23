"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Muestra su contenido con un fundido cuando entra en pantalla al hacer scroll.
 *
 * El contenido llega visible desde el servidor: solo se "arma" (se oculta) en
 * el cliente, y solo si está por debajo de lo que ya se ve. Así sin JavaScript,
 * con `prefers-reduced-motion` o al recargar a mitad de página nunca queda
 * nada invisible. El atributo `data-reveal` lo gestiona el DOM directamente
 * (React no lo renderiza), por lo que no provoca renders.
 */
export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    element.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.reveal = "visible";
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
