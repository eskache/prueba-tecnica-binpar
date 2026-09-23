import Term from "@/components/Term";
import type { LawStepProps } from "@/components/aprendizaje/LawStep";
import {
  ConstantVisual,
  DistanceVisual,
  MassVisual,
} from "@/components/aprendizaje/visuals";

/**
 * Guion de los pasos 2 a 4 (el paso 1, "esto es un cuerpo", vive en la página
 * porque no lleva fórmula). Cada paso "enciende" una pieza más de la fórmula:
 * masa, luego distancia, luego la constante.
 */
export const LAW_STEPS: readonly LawStepProps[] = [
  {
    id: "masa",
    label: "Paso 2: masa",
    visual: <MassVisual />,
    headline: (
      <>
        Todos los cuerpos tienen{" "}
        <Term
          word="masa"
          tone="mass"
          definition="La cantidad de materia que contiene un cuerpo. Se mide en kilogramos. En los dibujos, cuanto más grande es el círculo, más masa tiene."
        />
        .
      </>
    ),
    detail:
      "Cuanta más masa tiene un cuerpo, con más fuerza atrae a los demás. Por eso el Sol, que tiene muchísima, mantiene a todos los planetas girando a su alrededor.",
    lit: ["mass"],
    focus: "mass",
  },
  {
    id: "distancia",
    label: "Paso 3: distancia",
    visual: <DistanceVisual />,
    headline: (
      <>
        Cuanto menor es la{" "}
        <Term
          word="distancia"
          tone="distance"
          definition="Lo que separa a los dos cuerpos, medido entre sus centros. En la fórmula se llama r."
        />
        , mayor es la atracción.
      </>
    ),
    detail:
      "Si dos cuerpos se acercan, se atraen con más fuerza; si se alejan, con menos. Y el cambio es brusco: al doblar la distancia, la fuerza no se reduce a la mitad sino a la cuarta parte, porque en la fórmula la distancia va al cuadrado (2² = 4).",
    lit: ["mass", "distance"],
    focus: "distance",
  },
  {
    id: "constante",
    label: "Paso 4: constante universal",
    visual: <ConstantVisual />,
    headline: (
      <>
        Falta una pieza: la{" "}
        <Term
          word="constante universal"
          tone="constant"
          definition="Un número fijo que nunca cambia. Fija la escala de la gravedad: cuánta atracción hay para unas masas y una distancia dadas. Se representa con la letra G."
        />
        .
      </>
    ),
    detail:
      "G es un número diminuto que, hasta donde sabemos, es el mismo en todo el universo. Por eso la atracción entre tú y una mesa es imposible de notar: solo se hace evidente con cuerpos enormes, como los planetas.",
    lit: ["mass", "distance", "constant"],
    focus: "constant",
  },
];
