import type { FormulaVariable } from "./Formula";
import { spokenScientificNumber, type ScientificNumber } from "./scientificNumber";

export type BodyData = {
  id: "large" | "small";
  /** La masa del cuerpo, en kilogramos, y la variable de la fórmula que la
   * representa. Solo se conoce cuando el paso ya habla de masa. */
  mass?: { variable: FormulaVariable; inKg: ScientificNumber };
  /** Si el cuerpo se acerca al grande, atraído por él. */
  approachesLargeBody?: boolean;
};

const BODY_STYLES: Record<BodyData["id"], string> = {
  large: "h-28 w-28 bg-accent shadow-glow sm:h-40 sm:w-40",
  small: "h-8 w-8 bg-foreground shadow-glow-white sm:h-10 sm:w-10",
};

/** Flecha a la izquierda del cuerpo pequeño, apuntando hacia el grande. Oculta si
 * el usuario pide reducir el movimiento: sin la animación, no cabría entre ambos. */
function ApproachArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-full top-1/2 mr-2 h-4 w-8 -translate-y-1/2 text-foreground/60 opacity-0 motion-safe:animate-approach-hint"
    >
      <path d="M31 8H3M9 2L3 8l6 6" />
    </svg>
  );
}

type BodyProps = {
  body: BodyData;
  onHoverChange: (isHovered: boolean) => void;
};

export default function Body({ body, onHoverChange }: BodyProps) {
  const circleClassName = `relative rounded-full motion-safe:animate-float ${BODY_STYLES[body.id]}`;
  const arrow = body.approachesLargeBody ? <ApproachArrow /> : null;

  // El contenedor se desplaza al acercarse, y el círculo de dentro sigue flotando.
  const containerAnimationClass = body.approachesLargeBody
    ? "motion-safe:animate-approach"
    : "motion-safe:animate-fade-in";

  return (
    <div className={`shrink-0 ${containerAnimationClass}`}>
      {body.mass === undefined ? (
        <div aria-hidden="true" className={circleClassName}>
          {arrow}
        </div>
      ) : (
        <div
          role="img"
          tabIndex={0}
          aria-label={`Cuerpo con una masa de ${spokenScientificNumber(body.mass.inKg)} kilogramos`}
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          onFocus={() => onHoverChange(true)}
          onBlur={() => onHoverChange(false)}
          className={circleClassName}
        >
          {arrow}
        </div>
      )}
    </div>
  );
}
