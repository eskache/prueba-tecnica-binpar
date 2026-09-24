"use client";

import { useEffect, useMemo, useReducer, useRef, useState, type PointerEvent } from "react";
import { predictTrajectories, type Body, type Vector } from "@/physics/simulation";
import { BODY_STYLES, COLLISION_DISTANCE } from "./sceneBodies";
import SimulationControls from "./SimulationControls";
import { createInitialState, simulationReducer } from "./simulationState";

// Una vuelta completa dura 2π unidades de tiempo, unos 628 pasos de 0,01: tres vueltas
// son unos 1900 pasos.
const STEPS_FOR_THREE_ORBITS = 1900;

// La zona en la que se detecta el puntero sobre un cuerpo es algo más grande que su
// dibujo, para que sea fácil agarrarlo.
const GRAB_MARGIN = 0.08;

// Arrastrar un cuerpo hacia atrás una distancia de 0,5 le da velocidad 1, la de una
// órbita circular. La velocidad máxima está algo por encima de la de escape (√2 ≈ 1,41).
const SPEED_PER_PULL_DISTANCE = 2;
const MAX_SPEED = 1.6;

/** La velocidad que da arrastrar hacia atrás: es la contraria a la del arrastre. */
function velocityFromPull(pull: Vector): Vector {
  const velocity = { x: -pull.x * SPEED_PER_PULL_DISTANCE, y: -pull.y * SPEED_PER_PULL_DISTANCE };
  const speed = Math.hypot(velocity.x, velocity.y);

  if (speed <= MAX_SPEED) return velocity;

  const scale = MAX_SPEED / speed;
  return { x: velocity.x * scale, y: velocity.y * scale };
}

/** Convierte la lista de puntos en el texto que espera un <path> de SVG. */
function toPathData(points: Vector[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

type OrbitSceneProps = {
  /** Los cuerpos con los que empieza la escena. Solo se leen al montarla. */
  initialBodies: Body[];
  /** Los cuerpos a los que se les puede dar velocidad arrastrándolos hacia atrás. */
  draggableBodyIds: string[];
  /** Si es true, se muestran los botones para reproducir, pausar y reiniciar. */
  isPlayable?: boolean;
  /** Clases que dan el tamaño al dibujo, que es cuadrado. */
  className: string;
};

/** Dibuja los cuerpos y, para los que se pueden arrastrar, la órbita que recorrerían con
 * su velocidad. Arrastrando un cuerpo hacia atrás, como una goma, se cambia esa
 * velocidad. La simulación empieza en pausa y, si es reproducible, se pone en marcha. */
export default function OrbitScene({
  initialBodies,
  draggableBodyIds,
  isPlayable = false,
  className,
}: OrbitSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [state, dispatch] = useReducer(simulationReducer, initialBodies, createInitialState);
  const [draggedBodyId, setDraggedBodyId] = useState<string | null>(null);

  // Mientras la simulación corre, se avanza un poco en cada fotograma.
  useEffect(() => {
    if (!state.isRunning) return;

    let frameId = 0;
    function advance() {
      dispatch({ type: "tick" });
      frameId = requestAnimationFrame(advance);
    }
    frameId = requestAnimationFrame(advance);

    return () => cancelAnimationFrame(frameId);
  }, [state.isRunning]);

  // Las órbitas previstas solo se dibujan en pausa: en marcha los cuerpos ya se mueven.
  const trajectories = useMemo(
    () =>
      state.isRunning
        ? {}
        : predictTrajectories(state.bodies, STEPS_FOR_THREE_ORBITS, COLLISION_DISTANCE),
    [state.bodies, state.isRunning],
  );

  /** Dónde está el puntero, en las unidades del dibujo y no en píxeles de pantalla. */
  function pointerPosition(event: PointerEvent): Vector {
    const screenToDrawing = svgRef.current!.getScreenCTM()!.inverse();
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToDrawing);
    return { x: point.x, y: point.y };
  }

  function startDragging(bodyId: string, event: PointerEvent<SVGCircleElement>) {
    // Con la captura, el círculo sigue recibiendo el arrastre aunque el puntero salga de él.
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedBodyId(bodyId);
  }

  function drag(body: Body, event: PointerEvent<SVGCircleElement>) {
    if (draggedBodyId !== body.id) return;

    const pointer = pointerPosition(event);
    const pull = { x: pointer.x - body.position.x, y: pointer.y - body.position.y };
    dispatch({ type: "setVelocity", bodyId: body.id, velocity: velocityFromPull(pull) });
  }

  function stopDragging() {
    setDraggedBodyId(null);
  }

  const draggedBody = state.bodies.find((body) => body.id === draggedBodyId);

  return (
    <div className="flex flex-col items-center gap-8">
      <svg
        ref={svgRef}
        viewBox="-1.25 -1.25 2.5 2.5"
        role="img"
        aria-label="Cuerpos que se atraen por la gravedad, con la órbita que van a recorrer. Arrastra un cuerpo hacia atrás para cambiar su velocidad."
        className={`touch-none ${className}`}
      >
        {/* vectorEffect deja el grosor y el guion en píxeles, sin escalarlos con el viewBox. */}
        {draggableBodyIds.map((bodyId) => (
          <path
            key={bodyId}
            d={toPathData(trajectories[bodyId] ?? [])}
            fill="none"
            className={BODY_STYLES[bodyId].outlineClass}
            strokeWidth={2}
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {draggedBody && (
          <line
            x1={draggedBody.position.x}
            y1={draggedBody.position.y}
            x2={draggedBody.position.x - draggedBody.velocity.x / SPEED_PER_PULL_DISTANCE}
            y2={draggedBody.position.y - draggedBody.velocity.y / SPEED_PER_PULL_DISTANCE}
            className="stroke-velocity"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {state.bodies.map((body) => (
          <circle
            key={body.id}
            cx={body.position.x}
            cy={body.position.y}
            r={BODY_STYLES[body.id].radius}
            className={BODY_STYLES[body.id].fillClass}
          />
        ))}

        {/* Círculos invisibles, algo más grandes que los cuerpos, que reciben el arrastre.
            Con la simulación en marcha no se pueden arrastrar. */}
        {!state.isRunning &&
          state.bodies
            .filter((body) => draggableBodyIds.includes(body.id))
            .map((body) => (
              <circle
                key={body.id}
                cx={body.position.x}
                cy={body.position.y}
                r={BODY_STYLES[body.id].radius + GRAB_MARGIN}
                className="cursor-grab fill-transparent"
                onPointerDown={(event) => startDragging(body.id, event)}
                onPointerMove={(event) => drag(body, event)}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
              />
            ))}
      </svg>

      {isPlayable && (
        <SimulationControls
          isRunning={state.isRunning}
          onToggleRunning={() => dispatch({ type: "toggleRunning" })}
          onReset={() => dispatch({ type: "reset" })}
        />
      )}
    </div>
  );
}
