import { circularOrbitSpeed, type Body } from "@/physics/simulation";

// Los cuerpos de las escenas de simulación y cómo se dibujan. Las posiciones y
// velocidades están en las unidades normalizadas de la física (ver simulation.ts).

export type BodyColor = "accent" | "white" | "chaos" | "constant" | "distance" | "velocity";

// Clases de Tailwind de cada color, escritas enteras para que Tailwind las detecte.
export const BODY_COLOR_CLASSES: Record<
  BodyColor,
  {
    /** Color del cuerpo dibujado. */
    fill: string;
    /** Color de la línea discontinua con la órbita que va a recorrer. */
    outline: string;
    /** Color de la muestra que lo identifica en el panel. */
    swatch: string;
  }
> = {
  accent: { fill: "fill-accent", outline: "stroke-accent/70", swatch: "bg-accent" },
  white: { fill: "fill-foreground", outline: "stroke-orbit", swatch: "bg-foreground" },
  chaos: { fill: "fill-chaos", outline: "stroke-chaos", swatch: "bg-chaos" },
  constant: { fill: "fill-constant", outline: "stroke-constant", swatch: "bg-constant" },
  distance: { fill: "fill-distance", outline: "stroke-distance", swatch: "bg-distance" },
  velocity: { fill: "fill-velocity", outline: "stroke-velocity", swatch: "bg-velocity" },
};

/** Un cuerpo de la física más lo necesario para mostrarlo. `isUserAdded` es true en los
 * que añade el usuario, que son los únicos que se pueden quitar. */
export type SceneBody = Body & { name: string; color: BodyColor; isUserAdded?: boolean };

// El tamaño dibujado crece con la masa, pero muy poco a poco: las masas van desde
// millonésimas del Sol hasta el Sol entero, y con la raíz sexta (masa ** (1 / 6)) ese
// rango tan enorme se comprime y todos los cuerpos se ven, ni invisibles ni gigantes.
const MIN_RADIUS = 0.06;
const RADIUS_GROWTH = 0.14;

/** El radio de un cuerpo, en unidades de simulación, según su masa. No está a escala:
 * el Sol real sería invisible a esta distancia. */
export function radiusFromMass(mass: number): number {
  return MIN_RADIUS + RADIUS_GROWTH * mass ** (1 / 6);
}

const SUN_MASS = 1;
const EARTH_MASS = 0.000003;

const SUN: SceneBody = {
  id: "sun",
  name: "Sol",
  color: "accent",
  mass: SUN_MASS,
  radius: radiusFromMass(SUN_MASS),
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
};

// A distancia 1 del Sol, la Tierra describe un círculo perfecto.
const EARTH: SceneBody = {
  id: "earth",
  name: "Tierra",
  color: "white",
  mass: EARTH_MASS,
  radius: radiusFromMass(EARTH_MASS),
  position: { x: 1, y: 0 },
  velocity: { x: 0, y: circularOrbitSpeed(SUN_MASS, 1) },
};

// Un tercer cuerpo con bastante masa (la décima parte del Sol) para que su atracción
// cambie de verdad la órbita de la Tierra. Gira en el mismo sentido que ella.
const THIRD_BODY_MASS = 0.1;
const THIRD_BODY: SceneBody = {
  id: "third",
  name: "Tercer cuerpo",
  color: "chaos",
  mass: THIRD_BODY_MASS,
  radius: radiusFromMass(THIRD_BODY_MASS),
  position: { x: -0.7, y: 0 },
  velocity: { x: 0, y: -0.9 },
};

// Cómo se muestra el sistema del Sol y la Tierra: hasta dónde se prevé la órbita (una
// vuelta a la Tierra dura 2π unidades de tiempo, así que 19 son unas tres vueltas) y
// hasta qué distancia del Sol llega el dibujo.
export const SUN_AND_EARTH_PREDICTION_DURATION = 19;
export const SUN_AND_EARTH_VIEW_RADIUS = 1.25;

// Con el tercer cuerpo, la órbita prevista de la Tierra se aleja mucho más del Sol
// (hasta 2,6 unidades con la velocidad inicial): un dibujo tan ajustado como el del
// sistema de dos cuerpos la dejaría fuera del recuadro, cortada.
export const THREE_BODY_VIEW_RADIUS = 2.8;

export const TWO_BODY_SYSTEM: SceneBody[] = [SUN, EARTH];
export const THREE_BODY_SYSTEM: SceneBody[] = [SUN, EARTH, THIRD_BODY];

// Los sitios donde aparecen los cuerpos que añade el usuario, alrededor del Sol, sin
// tocar a los demás. Con eso se limita también cuántos se pueden añadir.
const NEW_BODY_SLOTS: { distance: number; angle: number; color: BodyColor }[] = [
  { distance: 0.55, angle: Math.PI, color: "constant" },
  { distance: 0.75, angle: Math.PI / 2, color: "distance" },
  { distance: 1.1, angle: -Math.PI / 2, color: "velocity" },
];

export const MAX_BODIES = TWO_BODY_SYSTEM.length + NEW_BODY_SLOTS.length;

function userAddedBodyId(slotNumber: number): string {
  return `extra-${slotNumber + 1}`;
}

/** Un cuerpo nuevo, ligero como la Tierra, en el primer sitio libre y con la velocidad de
 * una órbita circular alrededor del Sol, para que ya haga algo al reproducir.
 * Solo vale a partir del sistema de dos cuerpos (Sol y Tierra). Si el usuario quitó un
 * cuerpo, su sitio queda libre para el siguiente. */
export function createNewBody(existingBodies: SceneBody[]): SceneBody {
  const slotNumber = NEW_BODY_SLOTS.findIndex(
    (_, index) => !existingBodies.some((body) => body.id === userAddedBodyId(index)),
  );
  if (slotNumber === -1) throw new Error("No quedan sitios libres para más cuerpos");

  const slot = NEW_BODY_SLOTS[slotNumber];

  const position = {
    x: slot.distance * Math.cos(slot.angle),
    y: slot.distance * Math.sin(slot.angle),
  };

  // La velocidad va de lado, perpendicular a la línea que une el cuerpo con el Sol
  // (el mismo sentido que la Tierra).
  const speed = circularOrbitSpeed(SUN_MASS, slot.distance);
  const velocity = {
    x: (-position.y / slot.distance) * speed,
    y: (position.x / slot.distance) * speed,
  };

  return {
    id: userAddedBodyId(slotNumber),
    name: `Cuerpo ${slotNumber + TWO_BODY_SYSTEM.length + 1}`,
    color: slot.color,
    isUserAdded: true,
    mass: EARTH_MASS,
    radius: radiusFromMass(EARTH_MASS),
    position,
    velocity,
  };
}
