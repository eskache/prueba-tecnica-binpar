import { haveCollided, stepSystem, TIME_STEP, type Vector } from "@/physics/simulation";
import { createNewBody, MAX_BODIES, radiusFromMass, type SceneBody } from "./sceneBodies";

// Cuántos pasos de física se avanzan en cada fotograma. Con 3, una vuelta a la
// Tierra dura unos 3,5 segundos a 60 fotogramas por segundo. En pantallas de más
// fotogramas por segundo la simulación va más rápida.
const STEPS_PER_FRAME = 3;

export type SimulationState = {
  /** Cómo estaban los cuerpos al empezar, para poder reiniciar. */
  initialBodies: SceneBody[];
  bodies: SceneBody[];
  isRunning: boolean;
};

export type SimulationAction =
  | { type: "tick" }
  | { type: "toggleRunning" }
  | { type: "reset" }
  | { type: "addBody" }
  | { type: "removeBody"; bodyId: string }
  | { type: "setMass"; bodyId: string; mass: number }
  | { type: "setPosition"; bodyId: string; position: Vector }
  | { type: "setVelocity"; bodyId: string; velocity: Vector };

export function createInitialState(initialBodies: SceneBody[]): SimulationState {
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
        if (haveCollided(bodies)) {
          return { ...state, bodies, isRunning: false };
        }
      }

      return { ...state, bodies };
    }

    case "toggleRunning":
      return { ...state, isRunning: !state.isRunning };

    case "reset":
      return { ...state, bodies: state.initialBodies, isRunning: false };

    case "addBody":
      if (state.bodies.length >= MAX_BODIES) return state;
      return { ...state, bodies: [...state.bodies, createNewBody(state.bodies)] };

    // Solo se pueden quitar los cuerpos que añadió el usuario, no el Sol ni la Tierra.
    case "removeBody":
      return {
        ...state,
        bodies: state.bodies.filter((body) => body.id !== action.bodyId || !body.isUserAdded),
      };

    // Al cambiar la masa cambia también el tamaño con el que se dibuja el cuerpo.
    case "setMass":
      return {
        ...state,
        bodies: state.bodies.map((body) =>
          body.id === action.bodyId
            ? { ...body, mass: action.mass, radius: radiusFromMass(action.mass) }
            : body,
        ),
      };

    case "setPosition":
      return {
        ...state,
        bodies: state.bodies.map((body) =>
          body.id === action.bodyId ? { ...body, position: action.position } : body,
        ),
      };

    case "setVelocity":
      return {
        ...state,
        bodies: state.bodies.map((body) =>
          body.id === action.bodyId ? { ...body, velocity: action.velocity } : body,
        ),
      };
  }
}
