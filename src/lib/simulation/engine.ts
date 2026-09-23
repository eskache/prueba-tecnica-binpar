export type Vector2 = { x: number; y: number };

export type Body = {
  id: string;
  mass: number;
  position: Vector2;
  velocity: Vector2;
};

export type SimulationConfig = {
  /** Constante de gravitación "artística": ajustada para que el movimiento se
   * vea bien en un lienzo de unos cientos de píxeles, no el valor físico real
   * (6.674e-11), que a esa escala sería imperceptible. */
  gravitationalConstant: number;
  /** Evita que la fuerza se dispare a infinito cuando dos cuerpos casi se
   * solapan (r -> 0). Sustituye r² por (r² + softening²). */
  softening: number;
};

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  gravitationalConstant: 6000,
  softening: 14,
};

function computeAccelerations(
  bodies: Body[],
  config: SimulationConfig,
): Vector2[] {
  const softening2 = config.softening * config.softening;

  return bodies.map((body, i) => {
    let ax = 0;
    let ay = 0;

    for (let j = 0; j < bodies.length; j++) {
      if (j === i) continue;
      const other = bodies[j];
      const dx = other.position.x - body.position.x;
      const dy = other.position.y - body.position.y;
      const distSq = dx * dx + dy * dy + softening2;
      const dist = Math.sqrt(distSq);
      // a = G * m_other / r² (la masa del propio cuerpo se cancela: F/m = a)
      const accelMagnitude = (config.gravitationalConstant * other.mass) / distSq;
      ax += (accelMagnitude * dx) / dist;
      ay += (accelMagnitude * dy) / dist;
    }

    return { x: ax, y: ay };
  });
}

/**
 * Avanza la simulación un paso con integración de Verlet por velocidad
 * (leapfrog): a diferencia de Euler explícito, conserva la energía del
 * sistema en vez de acumular error y "inflar" las órbitas con el tiempo.
 * Mismo coste computacional que Euler, dos evaluaciones de aceleración por
 * paso en vez de una.
 */
export function stepSimulation(
  bodies: Body[],
  dt: number,
  config: SimulationConfig = DEFAULT_SIMULATION_CONFIG,
): Body[] {
  if (bodies.length === 0) return bodies;

  const accelAtT = computeAccelerations(bodies, config);

  const halfStepped = bodies.map((body, i) => ({
    ...body,
    velocity: {
      x: body.velocity.x + accelAtT[i].x * (dt / 2),
      y: body.velocity.y + accelAtT[i].y * (dt / 2),
    },
  }));

  const moved = halfStepped.map((body) => ({
    ...body,
    position: {
      x: body.position.x + body.velocity.x * dt,
      y: body.position.y + body.velocity.y * dt,
    },
  }));

  const accelAtTPlusDt = computeAccelerations(moved, config);

  return moved.map((body, i) => ({
    ...body,
    velocity: {
      x: body.velocity.x + accelAtTPlusDt[i].x * (dt / 2),
      y: body.velocity.y + accelAtTPlusDt[i].y * (dt / 2),
    },
  }));
}
