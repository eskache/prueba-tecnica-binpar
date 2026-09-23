import type { ReactNode } from "react";

export type FormulaVariable = "mass1" | "mass2";

/** Valores concretos que se muestran momentáneamente en lugar del símbolo. */
export type FormulaValues = Partial<Record<FormulaVariable, string>>;

// Cada masa tiene el color del cuerpo al que representa (ver Body.tsx).
const VARIABLES: Record<FormulaVariable, { symbol: ReactNode; colorClass: string }> = {
  mass1: {
    symbol: (
      <>
        m<sub>1</sub>
      </>
    ),
    colorClass: "text-accent",
  },
  mass2: {
    symbol: (
      <>
        m<sub>2</sub>
      </>
    ),
    colorClass: "text-foreground",
  },
};

type FormulaProps = {
  variables: FormulaVariable[];
  values?: FormulaValues;
};

/** Las variables de la fórmula que ya se han explicado, en la parte superior. */
export default function Formula({ variables, values = {} }: FormulaProps) {
  return (
    <div className="absolute inset-x-0 top-20 flex justify-center gap-8 text-5xl font-medium">
      {variables.map((variable) => (
        <span
          key={variable}
          className={`${VARIABLES[variable].colorClass} motion-safe:animate-fade-in`}
        >
          {values[variable] ?? VARIABLES[variable].symbol}
        </span>
      ))}
    </div>
  );
}
