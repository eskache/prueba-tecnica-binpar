import type { ReactNode } from "react";

/** Las piezas de la fórmula que representan un valor: masas, constante y distancia. */
export type FormulaVariable = "mass1" | "mass2" | "constant" | "distance";

/** Todo lo que puede aparecer en la fórmula: variables y operadores. Cada
 * operador tiene su propio nombre para que ninguna pieza se repita. */
export type FormulaPart = FormulaVariable | "timesConstant" | "timesMasses" | "divide";

/** Valores concretos que se muestran momentáneamente en lugar del símbolo. */
export type FormulaValues = Partial<Record<FormulaPart, ReactNode>>;

// Cada masa tiene el color del cuerpo al que representa (ver Body.tsx), la
// constante el violeta de la palabra "gravedad" y la distancia el azul de la
// palabra "distancia" y de la línea que separa los cuerpos.
const PARTS: Record<FormulaPart, { symbol: ReactNode; colorClass: string }> = {
  constant: {
    symbol: "G",
    colorClass: "text-constant",
  },
  timesConstant: {
    symbol: "×",
    colorClass: "text-muted",
  },
  mass1: {
    symbol: (
      <>
        m<sub>1</sub>
      </>
    ),
    colorClass: "text-accent",
  },
  timesMasses: {
    symbol: "×",
    colorClass: "text-muted",
  },
  mass2: {
    symbol: (
      <>
        m<sub>2</sub>
      </>
    ),
    colorClass: "text-foreground",
  },
  divide: {
    symbol: "÷",
    colorClass: "text-muted",
  },
  distance: {
    symbol: "r",
    colorClass: "text-distance",
  },
};

type FormulaProps = {
  parts: FormulaPart[];
  values?: FormulaValues;
};

/** Las piezas de la fórmula que ya se han explicado, en la parte superior. */
export default function Formula({ parts, values = {} }: FormulaProps) {
  // Los valores reales son mucho más largos que los símbolos: se escriben algo
  // más pequeños para que la fórmula no se desborde.
  const isShowingValues = parts.some((part) => values[part] !== undefined);
  const sizeClasses = isShowingValues ? "text-xl sm:text-4xl" : "text-3xl sm:text-5xl";

  return (
    <div
      className={`absolute inset-x-0 top-20 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 px-4 font-medium ${sizeClasses}`}
    >
      {parts.map((part) => (
        <span
          key={part}
          className={`${PARTS[part].colorClass} motion-safe:animate-fade-in`}
        >
          {values[part] ?? PARTS[part].symbol}
        </span>
      ))}
    </div>
  );
}
