"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SIMULATION_CONFIG,
  stepSimulation,
  type Body,
  type SimulationConfig,
  type Vector2,
} from "./engine";

export type BodySummary = { id: string; mass: number };

export const MAX_BODIES = 6;

const SUBSTEPS_PER_FRAME = 4;
const DT = 1 / 240;

let bodyCounter = 0;
export function createBody(
  position: Vector2,
  mass: number,
  velocity: Vector2 = { x: 0, y: 0 },
): Body {
  bodyCounter += 1;
  return { id: `body-${bodyCounter}`, mass, position, velocity };
}

function summarize(bodies: Body[]): BodySummary[] {
  return bodies.map((b) => ({ id: b.id, mass: b.mass }));
}

/**
 * Encapsula el bucle de animación de la simulación. Las posiciones y
 * velocidades viven en un ref y se actualizan a 60fps sin pasar por React:
 * disparar un render por frame sería trabajo desperdiciado, ya que quien
 * pinta los cuerpos es el <canvas> de forma imperativa, no React. El estado
 * de React (`summaries`) solo existe para alimentar los controles de la UI
 * (sliders de masa, lista de cuerpos), que cambian mucho menos a menudo.
 */
export function useOrbitSimulation(
  initialBodies: Body[],
  config: SimulationConfig = DEFAULT_SIMULATION_CONFIG,
) {
  const bodiesRef = useRef<Body[]>(initialBodies);
  const draggingId = useRef<string | null>(null);
  const [summaries, setSummaries] = useState<BodySummary[]>(() =>
    summarize(initialBodies),
  );

  const syncSummaries = useCallback(() => {
    setSummaries(summarize(bodiesRef.current));
  }, []);

  useEffect(() => {
    let frame: number;

    const loop = () => {
      if (!draggingId.current) {
        let next = bodiesRef.current;
        for (let i = 0; i < SUBSTEPS_PER_FRAME; i++) {
          next = stepSimulation(next, DT, config);
        }
        bodiesRef.current = next;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [config]);

  const addBody = useCallback(
    (position: Vector2, mass: number) => {
      if (bodiesRef.current.length >= MAX_BODIES) return false;
      bodiesRef.current = [...bodiesRef.current, createBody(position, mass)];
      syncSummaries();
      return true;
    },
    [syncSummaries],
  );

  const removeBody = useCallback(
    (id: string) => {
      bodiesRef.current = bodiesRef.current.filter((b) => b.id !== id);
      syncSummaries();
    },
    [syncSummaries],
  );

  const setMass = useCallback(
    (id: string, mass: number) => {
      bodiesRef.current = bodiesRef.current.map((b) =>
        b.id === id ? { ...b, mass } : b,
      );
      syncSummaries();
    },
    [syncSummaries],
  );

  const setPosition = useCallback((id: string, position: Vector2) => {
    bodiesRef.current = bodiesRef.current.map((b) =>
      b.id === id ? { ...b, position, velocity: { x: 0, y: 0 } } : b,
    );
  }, []);

  const startDrag = useCallback((id: string) => {
    draggingId.current = id;
  }, []);

  const endDrag = useCallback(() => {
    draggingId.current = null;
  }, []);

  return {
    bodiesRef,
    summaries,
    addBody,
    removeBody,
    setMass,
    setPosition,
    startDrag,
    endDrag,
  };
}
