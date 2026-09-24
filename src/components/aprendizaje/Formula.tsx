import type { ReactNode } from "react";

/** Las piezas de la fórmula que representan un valor: masas, constante y distancia. */
export type FormulaVariable = "mass1" | "mass2" | "constant" | "distance";

/** Todo lo que puede aparecer en la fórmula: las variables, la fuerza F, el signo
 * igual y los operadores. Cada operador tiene su propio nombre para que ninguna
 * pieza se repita. */
export type FormulaPart =
  | FormulaVariable
  | "force"
  | "equals"
  | "timesConstant"
  | "timesMasses";

/** Valores concretos que se muestran momentáneamente en lugar del símbolo. */
export type FormulaValues = Partial<Record<FormulaPart, ReactNode>>;

/** Dónde va cada pieza, como se escribe en los libros: F = G × (m₁ × m₂) / r
 * - "main": en línea, antes de la fracción.
 * - "numerator" y "denominator": arriba y abajo de la fracción. */
type Slot = "main" | "numerator" | "denominator";

type PartDefinition = { symbol: ReactNode; colorClass: string; slot: Slot };

// Cada masa tiene el color del cuerpo al que representa (ver Body.tsx), la
// constante el violeta de la palabra "gravedad" y la distancia el azul de la
// palabra "distancia" y de la línea que separa los cuerpos.
const PARTS: Record<FormulaPart, PartDefinition> = {
  force: { symbol: "F", colorClass: "text-foreground", slot: "main" },
  equals: { symbol: "=", colorClass: "text-muted", slot: "main" },
  constant: { symbol: "G", colorClass: "text-constant", slot: "main" },
  timesConstant: { symbol: "×", colorClass: "text-muted", slot: "main" },
  mass1: {
    symbol: (
      <>
        m<sub>1</sub>
      </>
    ),
    colorClass: "text-accent",
    slot: "numerator",
  },
  timesMasses: { symbol: "×", colorClass: "text-muted", slot: "numerator" },
  mass2: {
    symbol: (
      <>
        m<sub>2</sub>
      </>
    ),
    colorClass: "text-foreground",
    slot: "numerator",
  },
  distance: { symbol: "r", colorClass: "text-distance", slot: "denominator" },
};

type FormulaProps = {
  parts: FormulaPart[];
  values?: FormulaValues;
};

/** Las piezas de la fórmula que ya se han explicado, en la parte superior. */
export default function Formula({ parts, values = {} }: FormulaProps) {
  // Los valores reales son mucho más largos que los símbolos: se escriben algo
  // más pequeños para que la fórmula no se desborde ni se parta en dos líneas.
  // En móvil, además, la fracción es alta y hay poco sitio encima del contenido.
  const isShowingValues = parts.some((part) => values[part] !== undefined);
  const sizeClasses = isShowingValues ? "text-sm sm:text-4xl" : "text-xl sm:text-5xl";

  const partsIn = (slot: Slot) => parts.filter((part) => PARTS[part].slot === slot);
  const mainParts = partsIn("main");
  const numeratorParts = partsIn("numerator");
  const denominatorParts = partsIn("denominator");

  function renderPart(part: FormulaPart) {
    return (
      <span
        key={part}
        className={`${PARTS[part].colorClass} motion-safe:animate-fade-in`}
      >
        {values[part] ?? PARTS[part].symbol}
      </span>
    );
  }

  return (
    <div
      className={`absolute inset-x-0 top-18 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 font-medium sm:top-20 ${sizeClasses}`}
    >
      {mainParts.map(renderPart)}

      {numeratorParts.length > 0 && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-4">{numeratorParts.map(renderPart)}</div>

          {/* Sin denominador no hay fracción: el numerador queda en línea. */}
          {denominatorParts.length > 0 && (
            <div className="flex w-full justify-center border-t-2 border-muted/60 pt-1">
              <span className="sr-only">dividido entre</span>
              {denominatorParts.map(renderPart)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
