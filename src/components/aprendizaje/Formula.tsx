export type FormulaVariable = "mass";

/** Lo que se muestra momentáneamente en lugar del símbolo de una variable. */
export type FormulaOverride = {
  text: string;
  colorClass: string;
};

export type FormulaOverrides = Partial<Record<FormulaVariable, FormulaOverride>>;

const VARIABLES: Record<FormulaVariable, { symbol: string; colorClass: string }> = {
  mass: { symbol: "m", colorClass: "text-mass" },
};

type FormulaProps = {
  variables: FormulaVariable[];
  overrides?: FormulaOverrides;
};

/** Las variables de la fórmula que ya se han explicado, en la parte superior. */
export default function Formula({ variables, overrides = {} }: FormulaProps) {
  return (
    <div className="absolute inset-x-0 top-20 flex justify-center gap-4 text-5xl font-medium">
      {variables.map((variable) => {
        const override = overrides[variable];
        const text = override?.text ?? VARIABLES[variable].symbol;
        const colorClass = override?.colorClass ?? VARIABLES[variable].colorClass;

        return (
          <span
            key={variable}
            className={`${colorClass} transition-colors duration-200 motion-safe:animate-fade-in`}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
}
