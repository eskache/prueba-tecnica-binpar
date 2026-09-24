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
  position: Vector;
  velocity: Vector;
};

/** La constante de gravitación en unidades normalizadas (no es la del SI). */
const GRAVITATIONAL_CONSTANT = 1;

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

/** Avanza el sistema un instante (método de Euler): primero se mueve cada cuerpo con
 * la velocidad que tiene, y luego se le cambia la velocidad con la aceleración. */
export function stepSystem(bodies: Body[], timeStep: number): Body[] {
  return bodies.map((body) => {
    const acceleration = accelerationOn(body, bodies);

    return {
      ...body,
      position: {
        x: body.position.x + body.velocity.x * timeStep,
        y: body.position.y + body.velocity.y * timeStep,
      },
      velocity: {
        x: body.velocity.x + acceleration.x * timeStep,
        y: body.velocity.y + acceleration.y * timeStep,
      },
    };
  });
}

/** Adelanta la simulación `steps` pasos sobre una copia y devuelve por dónde pasa el
 * cuerpo indicado, empezando por donde está ahora. No modifica los cuerpos recibidos. */
export function predictTrajectory(bodies: Body[], bodyId: string, steps: number): Vector[] {
  const trajectory: Vector[] = [];
  let currentBodies = bodies;

  for (let step = 0; step <= steps; step++) {
    const body = currentBodies.find((candidate) => candidate.id === bodyId);
    if (!body) throw new Error(`No existe el cuerpo "${bodyId}"`);

    trajectory.push(body.position);
    currentBodies = stepSystem(currentBodies, TIME_STEP);
  }

  return trajectory;
}
