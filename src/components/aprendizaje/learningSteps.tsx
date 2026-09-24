import type { ReactNode } from "react";
import Term from "@/components/Term";
import type { BodyData } from "./Body";
import type { FormulaPart } from "./Formula";
import type { ScientificNumber } from "./scientificNumber";

/** Lo que el texto de un paso puede avisar a la pantalla. */
export type StepTextCallbacks = {
  /** La palabra "gravedad" se ha señalado (true) o ha dejado de estarlo (false). */
  onGravityHover: (isHovered: boolean) => void;
};

export type LearningStep = {
  text: (callbacks: StepTextCallbacks) => ReactNode;
  /** Los cuerpos que se ven en este paso. */
  bodies: BodyData[];
  /** Si se indica, se dibuja entre los dos cuerpos la línea de su distancia. */
  distanceInMeters?: ScientificNumber;
  /** Piezas de la fórmula que ya se han explicado al llegar a este paso, en orden. */
  formulaParts: FormulaPart[];
};

// Valor real de la constante de gravitación universal, en unidades del SI.
export const GRAVITATIONAL_CONSTANT: ScientificNumber = { mantissa: "6,674", exponent: -11 };

// Como ejemplo, el cuerpo naranja es el Sol y el blanco la Tierra: sus masas
// reales, en kilogramos, a partir del paso en que se habla de ellas.
const LARGE_BODY: BodyData = {
  id: "large",
  mass: { variable: "mass1", inKg: { mantissa: "1,989", exponent: 30 } },
};
const SMALL_BODY: BodyData = {
  id: "small",
  mass: { variable: "mass2", inKg: { mantissa: "5,972", exponent: 24 } },
};

export const LEARNING_STEPS: LearningStep[] = [
  {
    text: () => (
      <>
        Esto es un{" "}
        <Term
          word="cuerpo"
          definition="Cualquier objeto, de cualquier tamaño: una pelota, un planeta, una estrella. Como ejemplo usaremos el Sol (el cuerpo naranja) y la Tierra (el blanco)."
        />
        .
      </>
    ),
    bodies: [{ id: "large" }],
    formulaParts: [],
  },
  {
    text: () => (
      <>
        Todos los cuerpos tienen{" "}
        <Term
          word="masa"
          color="mass"
          definition="La cantidad de materia que tiene un cuerpo, medida en kilogramos. En la fórmula es la m: m₁ es la masa del Sol y m₂ la de la Tierra."
        />
        .
      </>
    ),
    bodies: [LARGE_BODY, SMALL_BODY],
    formulaParts: ["mass1", "timesMasses", "mass2"],
  },
  {
    text: ({ onGravityHover }) => (
      <>
        Todos los cuerpos se atraen entre sí debido a la{" "}
        <Term
          word="gravedad"
          color="constant"
          definition="Solo se nota con objetos enormes, como planetas o estrellas: entre objetos pequeños es demasiado débil para percibirse. Lo marca G, la constante universal (6,674 × 10⁻¹¹ en unidades del SI), un valor diminuto que se ha medido experimentalmente: no se sabe por qué es justo ese número."
          onHoverChange={onGravityHover}
        />
        .
      </>
    ),
    bodies: [LARGE_BODY, { ...SMALL_BODY, approachesLargeBody: true }],
    formulaParts: ["constant", "timesConstant", "mass1", "timesMasses", "mass2"],
  },
  {
    text: () => (
      <>
        La fuerza con la que se atraen depende de la{" "}
        <Term
          word="distancia"
          color="distance"
          definition="La separación entre los centros de los dos cuerpos, medida en metros. En la fórmula es la r. Aquí es la que separa a la Tierra del Sol: unos 150 millones de kilómetros."
        />{" "}
        a la que se encuentren.
      </>
    ),
    bodies: [LARGE_BODY, SMALL_BODY],
    // Distancia media entre la Tierra y el Sol.
    distanceInMeters: { mantissa: "1,496", exponent: 11 },
    formulaParts: [
      "constant",
      "timesConstant",
      "mass1",
      "timesMasses",
      "mass2",
      "divide",
      "distance",
    ],
  },
];
