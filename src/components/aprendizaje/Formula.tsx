import type { ReactNode } from "react";

/** Las piezas de la fórmula que representan un valor, como la masa de un cuerpo. */
export type FormulaVariable = "mass1" | "mass2";

/** Todo lo que puede aparecer en la fórmula: variables y operadores. */
export type FormulaPart = FormulaVariable | "times";

/** Valores concretos que se muestran momentáneamente en lugar del símbolo. */
export type FormulaValues = Partial<Record<FormulaPart, string>>;

// Cada masa tiene el color del cuerpo al que representa (ver Body.tsx).
const PARTS: Record<FormulaPart, { symbol: ReactNode; colorClass: string }> = {
  mass1: {
    symbol: (
      <>
        m<sub>1</sub>
      </>
    ),
    colorClass: "text-accent",
  },
  times: {
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
};

type FormulaProps = {
  parts: FormulaPart[];
  values?: FormulaValues;
};

/** Las piezas de la fórmula que ya se han explicado, en la parte superior. */
export default function Formula({ parts, values = {} }: FormulaProps) {
  return (
    <div className="absolute inset-x-0 top-20 flex justify-center gap-4 text-4xl font-medium sm:text-5xl">
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
