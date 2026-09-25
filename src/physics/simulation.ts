// Física de la simulación. Es TypeScript puro (sin React) para poder usarla igual
// desde la escena, desde la predicción de órbitas y, más adelante, desde la Parte B.
//
// Se trabaja en unidades normalizadas, no en metros ni kilogramos: la distancia
// entre la Tierra y el Sol es 1, la masa del Sol es 1 y la constante de gravitación
// vale 1. Así los números son cómodos y solo se convierten a píxeles al dibujar.

export type Vector = { x: number; y: number };

export type Body = {
  id: string;
  mass: number;
  /** El tamaño del cuerpo, que decide cuándo choca con otro. */
  radius: number;
  position: Vector;
  velocity: Vector;
};

/** La constante de gravitación en unidades normalizadas (no es la del SI). */
const GRAVITATIONAL_CONSTANT = 1;

/** La velocidad con la que un cuerpo describe un círculo perfecto alrededor de otro
 * mucho más pesado, a la distancia indicada. */
export function circularOrbitSpeed(centralMass: number, distance: number): number {
  return Math.sqrt((GRAVITATIONAL_CONSTANT * centralMass) / distance);
}

/** Cuánto tiempo avanza la simulación en cada paso. Cuanto más pequeño, más preciso. */
export const TIME_STEP = 0.01;

/** La aceleración que sufre un cuerpo por la atracción de todos los demás. */
function accelerationOn(body: Body, allBodies: Body[]): Vector {
  let x = 0;
  let y = 0;

  for (const other of allBodies) {
    if (other.id === body.id) continue;

    // Flecha que va del cuerpo hacia el otro, y su longitud (la distancia r).
    const dx = other.position.x - body.position.x;
    const dy = other.position.y - body.position.y;
    const distance = Math.hypot(dx, dy);

    // Aceleración = G × masa del otro / r², dirigida hacia el otro. Dividir la
    // flecha entre r la convierte en dirección pura; de ahí el r³ (r² × r).
    const strength = (GRAVITATIONAL_CONSTANT * other.mass) / distance ** 3;
    x += strength * dx;
    y += strength * dy;
  }

  return { x, y };
}

// Cómo avanzar el sistema un instante.
//
// La primera idea, el método de Euler, es la más simple: mover cada cuerpo con la
// velocidad que tiene y luego cambiarle la velocidad con la aceleración.
//
//   position += velocity * timeStep;
//   velocity += acceleration * timeStep;
//
// Tiene un fallo: en cada paso el cuerpo se mueve con la velocidad que tenía AL
// PRINCIPIO del paso, aunque la gravedad la esté curvando durante ese mismo paso. En
// una órbita eso significa que siempre se avanza un poco "recto", hacia fuera de la
// curva, y ese error se acumula en cada vuelta: con la velocidad de una órbita
// circular, la distancia al Sol pasaba de 1 a 1,29 en tres vueltas y la órbita se
// abría en espiral. El cuerpo ganaba energía de la nada.
//
// El leapfrog (salto de rana) arregla eso repartiendo el cambio de velocidad en dos
// mitades, una antes y otra después de mover el cuerpo, de modo que la posición se
// calcula con una velocidad "de en medio" del paso y no con la del principio. Cuesta
// lo mismo que Euler (una fuerza más por paso) y la órbita se mantiene cerrada porque
// los errores de un lado y del otro se compensan en vez de acumularse.

/** Cambia la velocidad de cada cuerpo con la aceleración que sufre durante `timeStep`. */
function kick<T extends Body>(bodies: T[], timeStep: number): T[] {
  return bodies.map((body) => {
    const acceleration = accelerationOn(body, bodies);

    return {
      ...body,
      velocity: {
        x: body.velocity.x + acceleration.x * timeStep,
        y: body.velocity.y + acceleration.y * timeStep,
      },
    };
  });
}

/** Mueve cada cuerpo con su velocidad actual durante `timeStep`. */
function drift<T extends Body>(bodies: T[], timeStep: number): T[] {
  return bodies.map((body) => ({
    ...body,
    position: {
      x: body.position.x + body.velocity.x * timeStep,
      y: body.position.y + body.velocity.y * timeStep,
    },
  }));
}

/** Avanza el sistema un instante (leapfrog): media patada, movimiento y otra media
 * patada, donde "patada" es el cambio de velocidad por la gravedad. */
export function stepSystem<T extends Body>(bodies: T[], timeStep: number): T[] {
  const halfKicked = kick(bodies, timeStep / 2);
  const moved = drift(halfKicked, timeStep);
  return kick(moved, timeStep / 2);
}

/** Si algún par de cuerpos se toca, es decir, si la distancia entre sus centros es menor
 * que la suma de sus radios: cerca de otro cuerpo la atracción se dispara y el resultado
 * dejaría de tener sentido. */
export function haveCollided(bodies: Body[]): boolean {
  for (let first = 0; first < bodies.length; first++) {
    for (let second = first + 1; second < bodies.length; second++) {
      const dx = bodies[second].position.x - bodies[first].position.x;
      const dy = bodies[second].position.y - bodies[first].position.y;
      const touchingDistance = bodies[first].radius + bodies[second].radius;
      if (Math.hypot(dx, dy) < touchingDistance) return true;
    }
  }

  return false;
}

/** Adelanta la simulación `steps` pasos sobre una copia y devuelve, para cada cuerpo
 * (por su id), por dónde pasa, empezando por donde está ahora. Se detiene antes si dos
 * cuerpos chocan. No modifica los cuerpos recibidos. */
export function predictTrajectories<T extends Body>(
  bodies: T[],
  steps: number,
): Record<string, Vector[]> {
  const trajectories: Record<string, Vector[]> = {};
  for (const body of bodies) trajectories[body.id] = [];

  let currentBodies = bodies;

  for (let step = 0; step <= steps; step++) {
    for (const body of currentBodies) trajectories[body.id].push(body.position);

    if (haveCollided(currentBodies)) break;

    currentBodies = stepSystem(currentBodies, TIME_STEP);
  }

  return trajectories;
}
