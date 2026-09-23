export type BodyData = {
  id: "large" | "small";
  /** Solo se conoce cuando el paso ya habla de masa. */
  massInKg?: number;
};

const BODY_STYLES: Record<BodyData["id"], string> = {
  large: "h-28 w-28 bg-accent shadow-glow sm:h-40 sm:w-40",
  small: "h-8 w-8 bg-foreground shadow-glow-white sm:h-10 sm:w-10",
};

/** El mismo color que el cuerpo, para pintar con él texto que lo represente. */
export const BODY_TEXT_COLORS: Record<BodyData["id"], string> = {
  large: "text-accent",
  small: "text-foreground",
};

type BodyProps = {
  body: BodyData;
  onHoverChange: (hoveredBody: BodyData | null) => void;
};

export default function Body({ body, onHoverChange }: BodyProps) {
  const circleClassName = `rounded-full motion-safe:animate-float ${BODY_STYLES[body.id]}`;

  return (
    <div className="shrink-0 motion-safe:animate-fade-in">
      {body.massInKg === undefined ? (
        <div aria-hidden="true" className={circleClassName} />
      ) : (
        <div
          role="img"
          tabIndex={0}
          aria-label={`Cuerpo con una masa de ${body.massInKg} kg`}
          onMouseEnter={() => onHoverChange(body)}
          onMouseLeave={() => onHoverChange(null)}
          onFocus={() => onHoverChange(body)}
          onBlur={() => onHoverChange(null)}
          className={circleClassName}
        />
      )}
    </div>
  );
}
