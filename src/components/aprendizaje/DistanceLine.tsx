import { spokenScientificNumber, type ScientificNumber } from "./scientificNumber";

type DistanceLineProps = {
  /** La distancia que representa la línea, en metros. */
  inMeters: ScientificNumber;
  onHoverChange: (isHovered: boolean) => void;
};

/** La línea que une los dos cuerpos y representa la distancia entre ellos. */
export default function DistanceLine({ inMeters, onHoverChange }: DistanceLineProps) {
  return (
    // El contenedor es más alto que el trazo para que sea fácil apuntar a la línea.
    <div
      role="img"
      tabIndex={0}
      aria-label={`Distancia entre los dos cuerpos: ${spokenScientificNumber(inMeters)} metros`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      className="group flex w-12 shrink-0 items-center py-4 motion-safe:animate-fade-in sm:w-28"
    >
      <div className="h-0.5 w-full rounded-full bg-distance transition-[height] group-hover:h-1 group-focus-visible:h-1" />
    </div>
  );
}
