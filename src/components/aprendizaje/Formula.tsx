export type FormulaVariable = "mass";

/** Valores concretos que sustituyen momentáneamente al símbolo de una variable. */
export type FormulaValues = Partial<Record<FormulaVariable, string>>;

const VARIABLES: Record<FormulaVariable, { symbol: string; colorClass: string }> = {
  mass: { symbol: "m", colorClass: "text-mass" },
};

type FormulaProps = {
  variables: FormulaVariable[];
  values?: FormulaValues;
};

/** Las variables de la fórmula que ya se han explicado, en la parte superior. */
export default function Formula({ variables, values = {} }: FormulaProps) {
  return (
    <div className="absolute inset-x-0 top-20 flex justify-center gap-4 text-5xl font-medium">
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
