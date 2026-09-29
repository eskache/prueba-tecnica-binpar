import type { SceneBody } from "@/components/simulacion/sceneBodies";

// Las seis soluciones periódicas del problema de los tres cuerpos de la galería.
//
// En todas hay tres cuerpos de masa 1 y la constante de gravitación vale 1 (las unidades
// normalizadas de simulation.ts). Las cuatro soluciones numéricas y la figura de ocho
// se dan, como en la literatura, a partir de una posición inicial en línea recta:
// los cuerpos 1 y 2 en (−1, 0) y (1, 0), el cuerpo 3 en (0, 0), los cuerpos 1 y 2 con
// velocidad (vx, vy) y el 3 con (−2vx, −2vy), para que el centro de masas no se mueva.
//
// Fuentes:
// - Lagrange, "Essai sur le problème des trois corps" (1772).
// - Chenciner y Montgomery, "A remarkable periodic solution of the three-body problem in
//   the case of equal masses", Annals of Mathematics 152 (2000): la figura de ocho, que
//   Moore descubrió numéricamente en 1993.
// - Šuvakov y Dmitrašinović, "Three classes of Newtonian three-body planar periodic
//   orbits", Physical Review Letters 110, 114301 (2013): Butterfly I, Goggles, Moth I y
//   Yin-Yang I.
//
// Las condiciones iniciales publicadas tienen cinco o seis cifras, así que la órbita se
// cierra solo aproximadamente (con un error de alrededor de 0,001). Se comprobó
// integrando un periodo con un método de precisión: los cuerpos vuelven a su posición
// y velocidad iniciales con ese error.

export type ThreeBodySolution = {
  /** Lo que aparece en la dirección de la página: /simulacion?solucion=<slug>. */
  slug: string;
  name: string;
  description: string;
  /** Lo que tarda en repetirse la órbita, en unidades de tiempo de la simulación. */
  period: number;
  /** Hasta qué distancia del centro llegan los cuerpos, con algo de margen para dibujarlos. */
  viewRadius: number;
  bodies: SceneBody[];
};

const BODY_RADIUS = 0.05;

/** Tres cuerpos iguales a partir de posiciones y velocidades dadas. */
function threeEqualBodies(
  positions: [number, number][],
  velocities: [number, number][],
): SceneBody[] {
  const looks = [
    { id: "body-1", name: "Cuerpo 1", color: "accent" },
    { id: "body-2", name: "Cuerpo 2", color: "white" },
    { id: "body-3", name: "Cuerpo 3", color: "chaos" },
  ] as const;

  return looks.map((look, index) => ({
    ...look,
    mass: 1,
    radius: BODY_RADIUS,
    position: { x: positions[index][0], y: positions[index][1] },
    velocity: { x: velocities[index][0], y: velocities[index][1] },
  }));
}

/** La posición inicial en línea recta de las órbitas numéricas: los cuerpos 1 y 2 con la
 * misma velocidad (vx, vy) y el 3, en el centro, con la opuesta y doble. */
function collinearStart(vx: number, vy: number): SceneBody[] {
  return threeEqualBodies(
    [
      [-1, 0],
      [1, 0],
      [0, 0],
    ],
    [
      [vx, vy],
      [vx, vy],
      [-2 * vx, -2 * vy],
    ],
  );
}

// Lagrange: los tres cuerpos en los vértices de un triángulo equilátero inscrito en una
// circunferencia de radio 1, girando sin deformarse. Para tres masas 1, la velocidad de
// cada cuerpo es 3^(−1/4) y una vuelta dura 2π dividido entre esa velocidad.
const LAGRANGE_SPEED = 3 ** (-1 / 4);
const LAGRANGE_ANGLES = [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3];
const LAGRANGE_BODIES = threeEqualBodies(
  LAGRANGE_ANGLES.map((angle) => [Math.cos(angle), Math.sin(angle)]),
  LAGRANGE_ANGLES.map((angle) => [-LAGRANGE_SPEED * Math.sin(angle), LAGRANGE_SPEED * Math.cos(angle)]),
);

export const THREE_BODY_SOLUTIONS: ThreeBodySolution[] = [
  {
    slug: "lagrange",
    name: "Lagrange",
    description:
      "Los tres cuerpos en los vértices de un triángulo equilátero que gira sin deformarse. Fue la primera solución periódica conocida. Es inestable: cualquier error diminuto la va deshaciendo.",
    period: (2 * Math.PI) / LAGRANGE_SPEED,
    viewRadius: 1.2,
    bodies: LAGRANGE_BODIES,
  },
  {
    slug: "figura-de-ocho",
    name: "Figura de ocho",
    description:
      "Los tres cuerpos persiguen el mismo camino en forma de ocho, siempre uno detrás de otro. La descubrió Moore en 1993 y la demostraron Chenciner y Montgomery en 2000.",
    period: 6.3259,
    viewRadius: 1.25,
    bodies: collinearStart(0.347111, 0.532728),
  },
  {
    slug: "butterfly-i",
    name: "Butterfly I",
    description:
      "Una órbita periódica con forma de mariposa, hallada numéricamente por Šuvakov y Dmitrašinović en 2013. Los cuerpos pasan muy cerca unos de otros.",
    period: 6.2356,
    viewRadius: 1.2,
    bodies: collinearStart(0.30689, 0.12551),
  },
  {
    slug: "goggles",
    name: "Goggles",
    description:
      "Una órbita periódica cuyos trazos recuerdan a unas gafas, hallada numéricamente por Šuvakov y Dmitrašinović en 2013.",
    period: 10.4668,
    viewRadius: 1.3,
    bodies: collinearStart(0.0833, 0.127889),
  },
  {
    slug: "moth-i",
    name: "Moth I",
    description:
      "Una órbita periódica con forma de polilla, hallada numéricamente por Šuvakov y Dmitrašinović en 2013.",
    period: 14.8939,
    viewRadius: 1.45,
    bodies: collinearStart(0.46444, 0.39606),
  },
  {
    slug: "yin-yang-i",
    name: "Yin-Yang I",
    description:
      "Una órbita periódica cuyos caminos se entrelazan como un yin-yang, hallada numéricamente por Šuvakov y Dmitrašinović en 2013.",
    period: 17.3284,
    viewRadius: 1.65,
    bodies: collinearStart(0.51394, 0.30474),
  },
];

/** La solución con esa dirección (slug), o undefined si no existe. */
export function findSolution(slug: string): ThreeBodySolution | undefined {
  return THREE_BODY_SOLUTIONS.find((solution) => solution.slug === slug);
}
