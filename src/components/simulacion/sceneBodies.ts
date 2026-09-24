import type { Body } from "@/physics/simulation";

// Los cuerpos de las escenas de simulación y cómo se dibujan. Las posiciones y
// velocidades están en las unidades normalizadas de la física (ver simulation.ts).

// Radios de dibujo en unidades de simulación. No están a escala: el Sol real sería
// invisible a esta distancia.
const SUN_RADIUS = 0.2;
const EARTH_RADIUS = 0.08;
const THIRD_BODY_RADIUS = 0.12;

/** Si dos cuerpos se acercan a menos de esto, se considera que han chocado. */
export const COLLISION_DISTANCE = SUN_RADIUS + EARTH_RADIUS;

// A distancia 1 del Sol, con velocidad 1 de lado la Tierra describe un círculo perfecto.
const CIRCULAR_ORBIT_SPEED = 1;

const SUN: Body = { id: "sun", mass: 1, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } };

const EARTH: Body = {
  id: "earth",
  mass: 0.000003,
  position: { x: 1, y: 0 },
  velocity: { x: 0, y: CIRCULAR_ORBIT_SPEED },
};

// Un tercer cuerpo con bastante masa (la décima parte del Sol) para que su atracción
// cambie de verdad la órbita de la Tierra. Gira en el mismo sentido que ella.
const THIRD_BODY: Body = {
  id: "third",
  mass: 0.1,
  position: { x: -0.7, y: 0 },
  velocity: { x: 0, y: -0.9 },
};

export const TWO_BODY_SYSTEM: Body[] = [SUN, EARTH];
export const THREE_BODY_SYSTEM: Body[] = [SUN, EARTH, THIRD_BODY];

type BodyStyle = {
  radius: number;
  /** Color del cuerpo. */
  fillClass: string;
  /** Color de la línea discontinua con la órbita que va a recorrer. */
  outlineClass: string;
};

export const BODY_STYLES: Record<Body["id"], BodyStyle> = {
  sun: { radius: SUN_RADIUS, fillClass: "fill-accent", outlineClass: "stroke-accent/70" },
  earth: { radius: EARTH_RADIUS, fillClass: "fill-foreground", outlineClass: "stroke-orbit" },
  third: { radius: THIRD_BODY_RADIUS, fillClass: "fill-chaos", outlineClass: "stroke-chaos" },
};
