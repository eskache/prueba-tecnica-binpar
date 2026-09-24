import { predictTrajectory, type Body, type Vector } from "@/physics/simulation";

// El Sol en el centro y la Tierra a distancia 1, moviéndose de lado. Con esta
// velocidad, la Tierra debería describir un círculo perfecto alrededor del Sol.
const CIRCULAR_ORBIT_SPEED = 1;

const BODIES: Body[] = [
  { id: "sun", mass: 1, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
  {
    id: "earth",
    mass: 0.000003,
    position: { x: 1, y: 0 },
    velocity: { x: 0, y: CIRCULAR_ORBIT_SPEED },
  },
];

// Una vuelta completa dura 2π unidades de tiempo, unos 628 pasos de 0,01: tres vueltas
// son unos 1900 pasos.
const STEPS_FOR_THREE_ORBITS = 1900;

// Radios de dibujo en unidades de simulación. No están a escala: el Sol real sería
// invisible a esta distancia.
const SUN_RADIUS = 0.08;
const EARTH_RADIUS = 0.03;

/** Convierte la lista de puntos en el texto que espera un <path> de SVG. */
function toPathData(points: Vector[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

/** Dibuja el Sol, la Tierra y la órbita que la Tierra recorrerá con su velocidad. */
export default function OrbitPreview() {
  const earth = BODIES[1];
  const trajectory = predictTrajectory(BODIES, "earth", STEPS_FOR_THREE_ORBITS);

  return (
    <svg
      viewBox="-1.5 -1.5 3 3"
      role="img"
      aria-label="El Sol y la Tierra, con la órbita que la Tierra va a recorrer"
      className="h-full max-h-[75vh] w-full max-w-3xl"
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
      <circle cx={earth.position.x} cy={earth.position.y} r={EARTH_RADIUS} className="fill-foreground" />
    </svg>
  );
}
