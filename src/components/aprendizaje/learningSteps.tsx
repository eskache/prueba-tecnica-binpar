import type { ReactNode } from "react";
import Term from "@/components/Term";
import type { FormulaVariable } from "./Formula";

export type LearningStep = {
  text: ReactNode;
  /** Variables de la fórmula que ya se han explicado al llegar a este paso. */
  formulaVariables: FormulaVariable[];
};

export const LEARNING_STEPS: LearningStep[] = [
  {
    text: (
      <>
        Esto es un{" "}
        <Term
          word="cuerpo"
          definition="En física, un cuerpo es cualquier objeto con masa: un planeta, una estrella, una pelota. Es el protagonista de la gravitación: dos cuerpos con masa siempre se atraen entre sí."
        />
        .
      </>
    ),
    formulaVariables: [],
  },
  {
    text: (
      <>
        Todos los cuerpos tienen{" "}
        <Term
          word="masa"
          color="mass"
          definition="La cantidad de materia que tiene un cuerpo. Cuanta más masa, más atrae a los demás. Se mide en kilogramos y en la fórmula se representa con la letra m."
        />
        .
      </>
    ),
    formulaVariables: ["mass"],
  },
];
