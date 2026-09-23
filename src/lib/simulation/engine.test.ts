import { describe, expect, it } from "vitest";
import { stepSimulation, type Body, DEFAULT_SIMULATION_CONFIG } from "./engine";

function totalMomentum(bodies: Body[]) {
  return bodies.reduce(
    (sum, b) => ({
      x: sum.x + b.mass * b.velocity.x,
      y: sum.y + b.mass * b.velocity.y,
    }),
    { x: 0, y: 0 },
  );
}

describe("stepSimulation", () => {
  it("keeps a lone body at rest (no self-force)", () => {
    const bodies: Body[] = [
      { id: "a", mass: 50, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
    ];

    const next = stepSimulation(bodies, 1 / 60);

    expect(next[0].position).toEqual({ x: 0, y: 0 });
    expect(next[0].velocity).toEqual({ x: 0, y: 0 });
  });

  it("conserves total momentum for an isolated two-body system", () => {
    let bodies: Body[] = [
      { id: "a", mass: 80, position: { x: -50, y: 0 }, velocity: { x: 0, y: 5 } },
      { id: "b", mass: 20, position: { x: 120, y: 0 }, velocity: { x: 0, y: -20 } },
    ];

    const initialMomentum = totalMomentum(bodies);

    for (let i = 0; i < 500; i++) {
      bodies = stepSimulation(bodies, 1 / 120);
    }

    const finalMomentum = totalMomentum(bodies);

    // Ningún cuerpo externo actúa sobre el sistema: el momento total no
    // debería derivar, más allá del error de punto flotante.
    expect(finalMomentum.x).toBeCloseTo(initialMomentum.x, 5);
    expect(finalMomentum.y).toBeCloseTo(initialMomentum.y, 5);
  });

  it("pulls two bodies toward each other", () => {
    const bodies: Body[] = [
      { id: "a", mass: 100, position: { x: -100, y: 0 }, velocity: { x: 0, y: 0 } },
      { id: "b", mass: 100, position: { x: 100, y: 0 }, velocity: { x: 0, y: 0 } },
    ];

    const next = stepSimulation(bodies, 1 / 60, DEFAULT_SIMULATION_CONFIG);

    // "a" está a la izquierda de "b": la atracción debe acelerarlo hacia +x.
    expect(next[0].velocity.x).toBeGreaterThan(0);
    // Y "b" hacia -x, por simetría.
    expect(next[1].velocity.x).toBeLessThan(0);
  });

  it("stays finite when two bodies nearly overlap, thanks to softening", () => {
    const bodies: Body[] = [
      { id: "a", mass: 100, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      { id: "b", mass: 100, position: { x: 0.001, y: 0 }, velocity: { x: 0, y: 0 } },
    ];

    const next = stepSimulation(bodies, 1 / 60);

    expect(Number.isFinite(next[0].velocity.x)).toBe(true);
    expect(Number.isFinite(next[1].velocity.x)).toBe(true);
  });
});
