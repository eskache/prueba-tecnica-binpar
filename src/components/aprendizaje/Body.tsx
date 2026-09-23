import type { FormulaVariable } from "./Formula";

export type BodyData = {
  id: "large" | "small";
  /** La masa del cuerpo y la variable de la fórmula que la representa.
   * Solo se conoce cuando el paso ya habla de masa. */
  mass?: { variable: FormulaVariable; inKg: number };
};

const BODY_STYLES: Record<BodyData["id"], string> = {
  large: "h-28 w-28 bg-accent shadow-glow sm:h-40 sm:w-40",
  small: "h-8 w-8 bg-foreground shadow-glow-white sm:h-10 sm:w-10",
};

type BodyProps = {
  body: BodyData;
  onHoverChange: (isHovered: boolean) => void;
};

export default function Body({ body, onHoverChange }: BodyProps) {
  const circleClassName = `rounded-full motion-safe:animate-float ${BODY_STYLES[body.id]}`;

  return (
    <div className="shrink-0 motion-safe:animate-fade-in">
      {body.mass === undefined ? (
        <div aria-hidden="true" className={circleClassName} />
      ) : (
        <div
          role="img"
          tabIndex={0}
          aria-label={`Cuerpo con una masa de ${body.mass.inKg} kg`}
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          onFocus={() => onHoverChange(true)}
          onBlur={() => onHoverChange(false)}
          className={circleClassName}
        />
      )}
    </div>
  );
}
