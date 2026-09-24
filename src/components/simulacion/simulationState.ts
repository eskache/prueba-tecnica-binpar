import { haveCollided, stepSystem, TIME_STEP, type Body, type Vector } from "@/physics/simulation";
import { COLLISION_DISTANCE } from "./sceneBodies";

// Cuántos pasos de física se avanzan en cada fotograma. Con 3, una vuelta a la
// Tierra dura unos 3,5 segundos a 60 fotogramas por segundo. En pantallas de más
// fotogramas por segundo la simulación va más rápida.
const STEPS_PER_FRAME = 3;

export type SimulationState = {
  /** Cómo estaban los cuerpos al empezar, para poder reiniciar. */
  initialBodies: Body[];
  bodies: Body[];
  isRunning: boolean;
};

export type SimulationAction =
  | { type: "tick" }
  | { type: "toggleRunning" }
  | { type: "reset" }
  | { type: "setVelocity"; bodyId: string; velocity: Vector };

export function createInitialState(initialBodies: Body[]): SimulationState {
  return { initialBodies, bodies: initialBodies, isRunning: false };
}

/** Todos los cambios de la simulación pasan por aquí: dado el estado y lo que ha
 * ocurrido, devuelve el estado nuevo. */
export function simulationReducer(
  state: SimulationState,
  action: SimulationAction,
): SimulationState {
  switch (action.type) {
    case "tick": {
      let bodies = state.bodies;

      for (let step = 0; step < STEPS_PER_FRAME; step++) {
        bodies = stepSystem(bodies, TIME_STEP);

        // Si dos cuerpos chocan, la simulación se para (y se puede reiniciar).
        if (haveCollided(bodies, COLLISION_DISTANCE)) {
          return { ...state, bodies, isRunning: false };
        }
      }

      return { ...state, bodies };
    }

    case "toggleRunning":
      return { ...state, isRunning: !state.isRunning };

    case "reset":
      return { ...state, bodies: state.initialBodies, isRunning: false };

    case "setVelocity":
      return {
        ...state,
        bodies: state.bodies.map((body) =>
          body.id === action.bodyId ? { ...body, velocity: action.velocity } : body,
        ),
      };
  }
}
