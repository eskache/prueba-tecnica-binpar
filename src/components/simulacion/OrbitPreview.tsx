"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { predictTrajectory, type Body, type Vector } from "@/physics/simulation";

// El Sol en el centro y la Tierra a distancia 1. Con velocidad 1 de lado, la Tierra
// describiría un círculo perfecto; el usuario puede cambiarla arrastrándola.
const CIRCULAR_ORBIT_SPEED = 1;

const SUN: Body = { id: "sun", mass: 1, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } };
const EARTH_POSITION: Vector = { x: 1, y: 0 };

// Una vuelta completa dura 2π unidades de tiempo, unos 628 pasos de 0,01: tres vueltas
// son unos 1900 pasos.
const STEPS_FOR_THREE_ORBITS = 1900;

// Radios de dibujo en unidades de simulación. No están a escala: el Sol real sería
// invisible a esta distancia.
const SUN_RADIUS = 0.08;
const EARTH_RADIUS = 0.03;

// Zona en la que se detecta el puntero sobre la Tierra: más grande que el dibujo para
// que sea fácil agarrarla.
const EARTH_GRAB_RADIUS = 0.1;

// Arrastrar la Tierra hacia atrás una distancia de 0,5 le da velocidad 1, la de una
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

/** Dibuja el Sol, la Tierra y la órbita que la Tierra recorrerá con su velocidad.
 * Arrastrando la Tierra hacia atrás, como una goma, se cambia esa velocidad. */
export default function OrbitPreview() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [earthVelocity, setEarthVelocity] = useState<Vector>({ x: 0, y: CIRCULAR_ORBIT_SPEED });
  const [isDragging, setIsDragging] = useState(false);

  const trajectory = useMemo(() => {
    const earth: Body = {
      id: "earth",
      mass: 0.000003,
      position: EARTH_POSITION,
      velocity: earthVelocity,
    };
    return predictTrajectory([SUN, earth], "earth", STEPS_FOR_THREE_ORBITS, SUN_RADIUS + EARTH_RADIUS);
  }, [earthVelocity]);

  /** Dónde está el puntero, en las unidades del dibujo y no en píxeles de pantalla. */
  function pointerPosition(event: PointerEvent): Vector {
    const screenToDrawing = svgRef.current!.getScreenCTM()!.inverse();
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToDrawing);
    return { x: point.x, y: point.y };
  }

  function startDragging(event: PointerEvent<SVGCircleElement>) {
    // Con la captura, el círculo sigue recibiendo el arrastre aunque el puntero salga de él.
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function drag(event: PointerEvent<SVGCircleElement>) {
    if (!isDragging) return;

    const pointer = pointerPosition(event);
    const pull = { x: pointer.x - EARTH_POSITION.x, y: pointer.y - EARTH_POSITION.y };
    setEarthVelocity(velocityFromPull(pull));
  }

  function stopDragging() {
    setIsDragging(false);
  }

  // La goma acaba donde estaría el puntero, con el límite de velocidad ya aplicado.
  const rubberBandEnd = {
    x: EARTH_POSITION.x - earthVelocity.x / SPEED_PER_PULL_DISTANCE,
    y: EARTH_POSITION.y - earthVelocity.y / SPEED_PER_PULL_DISTANCE,
  };

  return (
    <svg
      ref={svgRef}
      viewBox="-1.5 -1.5 3 3"
      role="img"
      aria-label="El Sol y la Tierra, con la órbita que la Tierra va a recorrer. Arrastra la Tierra hacia atrás para cambiar su velocidad."
      className="h-full max-h-[75vh] w-full max-w-3xl touch-none"
    >
      {/* vectorEffect deja el grosor y el guion en píxeles, sin escalarlos con el viewBox. */}
      <path
        d={toPathData(trajectory)}
        fill="none"
        className="stroke-muted"
        strokeWidth={2}
        strokeDasharray="6 6"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={0} cy={0} r={SUN_RADIUS} className="fill-accent" />

      {isDragging && (
        <line
          x1={EARTH_POSITION.x}
          y1={EARTH_POSITION.y}
          x2={rubberBandEnd.x}
          y2={rubberBandEnd.y}
          className="stroke-foreground"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <circle cx={EARTH_POSITION.x} cy={EARTH_POSITION.y} r={EARTH_RADIUS} className="fill-foreground" />

      {/* Círculo invisible y más grande que la Tierra, que es el que recibe el arrastre. */}
      <circle
        cx={EARTH_POSITION.x}
        cy={EARTH_POSITION.y}
        r={EARTH_GRAB_RADIUS}
        className="cursor-grab fill-transparent"
        onPointerDown={startDragging}
        onPointerMove={drag}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      />
    </svg>
  );
}
