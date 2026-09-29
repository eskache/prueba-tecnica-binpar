"use client";

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { predictTrajectories, type Vector } from "@/physics/simulation";
import BodiesPanel from "./BodiesPanel";
import { BODY_COLOR_CLASSES, MAX_BODIES, type SceneBody } from "./sceneBodies";
import SimulationControls from "./SimulationControls";
import { createInitialState, simulationReducer } from "./simulationState";

// La zona en la que se detecta el puntero sobre un cuerpo es algo más grande que su
// dibujo, para que sea fácil agarrarlo. Es una fracción de viewRadius (no un tamaño
// fijo): dos escenas del mismo tamaño en píxeles pero con distinto viewRadius dibujan
// el mismo sistema más grande o más pequeño, y sin esto la zona de agarre se encogería
// en las escenas más alejadas hasta quedar inutilizable en pantallas pequeñas.
const GRAB_MARGIN_RATIO = 0.1;

// Arrastrar un cuerpo hacia atrás una distancia de 0,5 le da velocidad 1, la de una
// órbita circular. La velocidad máxima está algo por encima de la de escape (√2 ≈ 1,41).
const SPEED_PER_PULL_DISTANCE = 2;
const MAX_SPEED = 1.6;

// Cuánto más grande se dibuja el marco que la órbita prevista que tiene que caber en él.
const VIEW_RADIUS_MARGIN = 1.1;

// Un límite a lo que se puede alejar el dibujo: una velocidad de escape aleja mucho a un
// cuerpo (aunque nunca llegue a "escapar" del todo, porque la predicción dura un tiempo
// fijo), y sin límite el dibujo se alejaría hasta dejar los cuerpos como puntos.
const MAX_VIEW_RADIUS = 6;

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
  initialBodies: SceneBody[];
  /** Los cuerpos a los que se les puede dar velocidad arrastrándolos hacia atrás: los
   * indicados por su id, o todos. */
  draggableBodies: string[] | "all";
  /** Si es false, los cuerpos pueden acercarse tanto como quieran sin que la simulación
   * se pare (por defecto se para cuando dos chocan). */
  stopsOnCollision?: boolean;
  /** Hasta cuándo se prevé la órbita, en unidades de tiempo de la simulación. */
  predictionDuration: number;
  /** Hasta qué distancia del centro se dibuja como mínimo (el dibujo se aleja más si la
   * órbita prevista no cabe: ver `effectiveViewRadius`). */
  viewRadius: number;
  /** Lo que se muestra sobre el panel de cuerpos (p. ej. la lista de sistemas). */
  panelHeader?: ReactNode;
  /** Si es true, se muestra el panel de control (reproducir, pausar, reiniciar y añadir
   * cuerpos). */
  isPlayable?: boolean;
  /** Clases que dan el tamaño al dibujo, que es cuadrado. */
  className: string;
};

/** Dibuja los cuerpos y, para los que se pueden arrastrar, la órbita que recorrerían con
 * su velocidad. Arrastrando un cuerpo hacia atrás, como una goma, se cambia esa
 * velocidad. La simulación empieza en pausa y, si es reproducible, se pone en marcha. */
export default function OrbitScene({
  initialBodies,
  draggableBodies,
  isPlayable = false,
  stopsOnCollision = true,
  predictionDuration,
  viewRadius,
  panelHeader,
  className,
}: OrbitSceneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [state, dispatch] = useReducer(simulationReducer, { initialBodies, stopsOnCollision }, createInitialState);
  const [draggedBodyId, setDraggedBodyId] = useState<string | null>(null);
  // El marco con el que se empezó el arrastre en curso, o null si no hay ninguno (ver
  // más abajo, junto a su uso).
  const [viewRadiusBeforeDrag, setViewRadiusBeforeDrag] = useState<number | null>(null);

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
        : predictTrajectories(state.bodies, predictionDuration, state.stopsOnCollision),
    [state.bodies, state.isRunning, state.stopsOnCollision, predictionDuration],
  );

  const draggableBodyList = state.bodies.filter(
    (body) => draggableBodies === "all" || draggableBodies.includes(body.id),
  );

  // Si la órbita prevista se aleja más que el marco fijado (`viewRadius`), el dibujo se
  // aleja para que quepa entera: si no, el arrastre del usuario podría dejarla cortada,
  // fuera del recuadro. Con los cuerpos en marcha, o sin predicción, se usa el marco fijo.
  let trajectoryRadius = 0;
  for (const path of Object.values(trajectories)) {
    for (const point of path) {
      trajectoryRadius = Math.max(trajectoryRadius, Math.hypot(point.x, point.y));
    }
  }
  const liveViewRadius = Math.min(
    Math.max(viewRadius, trajectoryRadius * VIEW_RADIUS_MARGIN),
    MAX_VIEW_RADIUS,
  );

  // Mientras se arrastra un cuerpo, el marco se queda como estaba al empezar el gesto: si
  // cambiara con cada movimiento, la conversión de píxeles a coordenadas de la escena (que
  // usa el propio marco) cambiaría a mitad de arrastre, y un pequeño movimiento del ratón
  // podría verse amplificado en un cambio de velocidad enorme, sin control.
  const effectiveViewRadius = viewRadiusBeforeDrag ?? liveViewRadius;

  /** Dónde está el puntero, en las unidades del dibujo y no en píxeles de pantalla. */
  function pointerPosition(event: PointerEvent): Vector {
    const screenToDrawing = svgRef.current!.getScreenCTM()!.inverse();
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToDrawing);
    return { x: point.x, y: point.y };
  }

  function startDragging(bodyId: string, event: PointerEvent<SVGCircleElement>) {
    // Agarrar un cuerpo lo elige: se abre su tarjeta en el panel.
    dispatch({ type: "selectBody", bodyId });
    // Con la captura, el círculo sigue recibiendo el arrastre aunque el puntero salga de él.
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedBodyId(bodyId);
    setViewRadiusBeforeDrag(liveViewRadius);
  }

  function drag(body: SceneBody, event: PointerEvent<SVGCircleElement>) {
    if (draggedBodyId !== body.id) return;

    const pointer = pointerPosition(event);
    const pull = { x: pointer.x - body.position.x, y: pointer.y - body.position.y };
    dispatch({ type: "setVelocity", bodyId: body.id, velocity: velocityFromPull(pull) });
  }

  function stopDragging() {
    setDraggedBodyId(null);
    setViewRadiusBeforeDrag(null);
  }

  const draggedBody = state.bodies.find((body) => body.id === draggedBodyId);
  const selectedBody = state.bodies.find((body) => body.id === state.selectedBodyId);

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-12">
      {/* En móvil, el dibujo y los botones se quedan fijos arriba mientras se desplaza el
          panel de cuerpos, para ver el efecto de cada cambio mientras se hace. */}
      <div
        className={`flex flex-col items-center gap-3 ${
          isPlayable ? "sticky top-0 z-10 w-full bg-background py-2 lg:static lg:w-auto" : ""
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`${-effectiveViewRadius} ${-effectiveViewRadius} ${2 * effectiveViewRadius} ${2 * effectiveViewRadius}`}
          role="img"
          aria-label="Cuerpos que se atraen por la gravedad, con la órbita que van a recorrer. Arrastra un cuerpo hacia atrás para cambiar su velocidad."
          className={`touch-none ${className}`}
        >
          {/* vectorEffect deja el grosor y el guion en píxeles, sin escalarlos con el viewBox. */}
          {draggableBodyList.map((body) => (
            <path
              key={body.id}
              d={toPathData(trajectories[body.id] ?? [])}
              fill="none"
              className={BODY_COLOR_CLASSES[body.color].outline}
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
              r={body.radius}
              className={BODY_COLOR_CLASSES[body.color].fill}
            />
          ))}

          {/* Un anillo señala el cuerpo elegido, el de la tarjeta abierta en el panel. */}
          {isPlayable && selectedBody && (
            <circle
              cx={selectedBody.position.x}
              cy={selectedBody.position.y}
              r={selectedBody.radius + 0.05}
              fill="none"
              className="stroke-foreground"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Círculos invisibles, algo más grandes que los cuerpos, que reciben el arrastre.
              Con la simulación en marcha no se pueden arrastrar. */}
          {!state.isRunning &&
            draggableBodyList.map((body) => (
              <circle
                key={body.id}
                cx={body.position.x}
                cy={body.position.y}
                r={body.radius + effectiveViewRadius * GRAB_MARGIN_RATIO}
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
            canAddBody={state.bodies.length < MAX_BODIES}
            onToggleRunning={() => dispatch({ type: "toggleRunning" })}
            onReset={() => dispatch({ type: "reset" })}
            onAddBody={() => dispatch({ type: "addBody" })}
          />
        )}
      </div>

      {isPlayable && (
        <div className="flex w-full max-w-sm flex-col gap-4 lg:max-h-[calc(100vh-9rem)] lg:w-80">
          {panelHeader}
          <BodiesPanel
            bodies={state.bodies}
            selectedBodyId={state.selectedBodyId}
            onSelectBody={(bodyId) => dispatch({ type: "selectBody", bodyId })}
            onRemoveBody={(bodyId) => dispatch({ type: "removeBody", bodyId })}
            onMassChange={(bodyId, mass) => dispatch({ type: "setMass", bodyId, mass })}
            onPositionChange={(bodyId, position) =>
              dispatch({ type: "setPosition", bodyId, position })
            }
            onVelocityChange={(bodyId, velocity) =>
              dispatch({ type: "setVelocity", bodyId, velocity })
            }
          />
        </div>
      )}
    </div>
  );
}
