import type { ReactNode } from "react";
import Term from "@/components/Term";
import type { BodyData } from "./Body";
import type { FormulaPart } from "./Formula";

export type LearningStep = {
  text: ReactNode;
  /** Los cuerpos que se ven en este paso. */
  bodies: BodyData[];
  /** Piezas de la fórmula que ya se han explicado al llegar a este paso, en orden. */
  formulaParts: FormulaPart[];
};

// Los dos cuerpos, ya con su masa, a partir del paso en que se habla de ella.
const LARGE_BODY: BodyData = { id: "large", mass: { variable: "mass1", inKg: 100 } };
const SMALL_BODY: BodyData = { id: "small", mass: { variable: "mass2", inKg: 10 } };

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
    bodies: [{ id: "large" }],
    formulaParts: [],
  },
  {
    text: (
      <>
        Todos los cuerpos tienen{" "}
        <Term
          word="masa"
          color="mass"
          definition="La cantidad de materia que tiene un cuerpo. Cuanta más masa, más atrae a los demás. Se mide en kilogramos y en la fórmula se representa con la letra m: m₁ y m₂ son las masas de los dos cuerpos."
        />
        .
      </>
    ),
    bodies: [LARGE_BODY, SMALL_BODY],
    formulaParts: ["mass1", "times", "mass2"],
  },
  {
    text: (
      <>
        Todos los cuerpos se atraen entre sí debido a la{" "}
        <Term
          word="gravedad"
          color="constant"
          definition="La atracción que ejercen entre sí todos los cuerpos con masa. Cuánto atraen depende de sus masas, de la distancia que los separa y de una constante universal, siempre la misma, que se representa con la letra G."
        />
        .
      </>
    ),
    bodies: [LARGE_BODY, { ...SMALL_BODY, approachesLargeBody: true }],
    formulaParts: ["mass1", "times", "mass2"],
  },
];
