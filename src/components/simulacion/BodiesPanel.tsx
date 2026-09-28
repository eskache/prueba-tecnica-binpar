import { spokenScientificNumber, toScientificNumber } from "@/components/aprendizaje/scientificNumber";
import type { Vector } from "@/physics/simulation";
import InfoTip from "./InfoTip";
import LabeledSlider from "./LabeledSlider";
import NumberField from "./NumberField";
import { BODY_COLOR_CLASSES, MAX_BODIES, type SceneBody } from "./sceneBodies";

// Las masas van desde millonésimas de la del Sol hasta la del Sol entero, así que el
// slider es logarítmico: su valor es el exponente de la masa (10 elevado a ese valor).
// De lo contrario, todas las masas útiles quedarían pegadas a un extremo del slider.
const MIN_MASS_EXPONENT = -6;
const MAX_MASS_EXPONENT = 0;
const MIN_MASS = 10 ** MIN_MASS_EXPONENT;
const MAX_MASS = 10 ** MAX_MASS_EXPONENT;
const MASS_EXPONENT_STEP = 0.05;

// Cada componente de la velocidad (en x y en y) va de -2 a 2: una órbita circular a
// distancia 1 del Sol tiene velocidad 1, y la de escape es √2 ≈ 1,41.
const MAX_VELOCITY_COMPONENT = 2;
const VELOCITY_STEP = 0.01;

// La posición en x y en y va de -1,25 a 1,25: los límites de lo que se dibuja.
const MAX_POSITION_COMPONENT = 1.25;
const POSITION_STEP = 0.01;

/** Un número con hasta cuatro decimales y coma decimal, como se escribe en español. */
function formatDecimal(value: number): string {
  return String(parseFloat(value.toFixed(4))).replace(".", ",");
}

/** Una masa en notación científica con un decimal, p. ej. 3,0e-6. */
function formatMass(mass: number): string {
  return mass.toExponential(1).replace(".", ",");
}

type BodyControlsProps = {
  body: SceneBody;
  onMassChange: (bodyId: string, mass: number) => void;
  onPositionChange: (bodyId: string, position: Vector) => void;
  onVelocityChange: (bodyId: string, velocity: Vector) => void;
};

/** Los cinco controles de un cuerpo: masa, posición (x, y) y velocidad (x, y). */
function BodyControls({
  body,
  onMassChange,
  onPositionChange,
  onVelocityChange,
}: BodyControlsProps) {
  const mass = toScientificNumber(body.mass);

  return (
    <div className="flex flex-col gap-2">
      <LabeledSlider
        label="Masa"
        field={
          <NumberField
            value={body.mass}
            format={formatMass}
            ariaLabel={`Masa de ${body.name}, escrita`}
            min={MIN_MASS}
            max={MAX_MASS}
            onCommit={(newMass) => onMassChange(body.id, newMass)}
          />
        }
        spokenValue={`${spokenScientificNumber(mass)} masas solares`}
        ariaLabel={`Masa de ${body.name}`}
        min={MIN_MASS_EXPONENT}
        max={MAX_MASS_EXPONENT}
        step={MASS_EXPONENT_STEP}
        value={Math.log10(body.mass)}
        onChange={(exponent) => onMassChange(body.id, 10 ** exponent)}
      />

      <LabeledSlider
        label="Posición en x"
        field={
          <NumberField
            value={body.position.x}
            format={formatDecimal}
            ariaLabel={`Posición en x de ${body.name}, escrita`}
            min={-MAX_POSITION_COMPONENT}
            max={MAX_POSITION_COMPONENT}
            onCommit={(x) => onPositionChange(body.id, { ...body.position, x })}
          />
        }
        spokenValue={formatDecimal(body.position.x)}
        ariaLabel={`Posición en x de ${body.name}`}
        min={-MAX_POSITION_COMPONENT}
        max={MAX_POSITION_COMPONENT}
        step={POSITION_STEP}
        value={body.position.x}
        onChange={(x) => onPositionChange(body.id, { ...body.position, x })}
      />

      <LabeledSlider
        label="Posición en y"
        field={
          <NumberField
            value={body.position.y}
            format={formatDecimal}
            ariaLabel={`Posición en y de ${body.name}, escrita`}
            min={-MAX_POSITION_COMPONENT}
            max={MAX_POSITION_COMPONENT}
            onCommit={(y) => onPositionChange(body.id, { ...body.position, y })}
          />
        }
        spokenValue={formatDecimal(body.position.y)}
        ariaLabel={`Posición en y de ${body.name}`}
        min={-MAX_POSITION_COMPONENT}
        max={MAX_POSITION_COMPONENT}
        step={POSITION_STEP}
        value={body.position.y}
        onChange={(y) => onPositionChange(body.id, { ...body.position, y })}
      />

      <LabeledSlider
        label="Velocidad en x"
        field={
          <NumberField
            value={body.velocity.x}
            format={formatDecimal}
            ariaLabel={`Velocidad en x de ${body.name}, escrita`}
            min={-MAX_VELOCITY_COMPONENT}
            max={MAX_VELOCITY_COMPONENT}
            onCommit={(x) => onVelocityChange(body.id, { ...body.velocity, x })}
          />
        }
        spokenValue={formatDecimal(body.velocity.x)}
        ariaLabel={`Velocidad en x de ${body.name}`}
        min={-MAX_VELOCITY_COMPONENT}
        max={MAX_VELOCITY_COMPONENT}
        step={VELOCITY_STEP}
        value={body.velocity.x}
        onChange={(x) => onVelocityChange(body.id, { ...body.velocity, x })}
      />

      <LabeledSlider
        label="Velocidad en y"
        field={
          <NumberField
            value={body.velocity.y}
            format={formatDecimal}
            ariaLabel={`Velocidad en y de ${body.name}, escrita`}
            min={-MAX_VELOCITY_COMPONENT}
            max={MAX_VELOCITY_COMPONENT}
            onCommit={(y) => onVelocityChange(body.id, { ...body.velocity, y })}
          />
        }
        spokenValue={formatDecimal(body.velocity.y)}
        ariaLabel={`Velocidad en y de ${body.name}`}
        min={-MAX_VELOCITY_COMPONENT}
        max={MAX_VELOCITY_COMPONENT}
        step={VELOCITY_STEP}
        value={body.velocity.y}
        onChange={(y) => onVelocityChange(body.id, { ...body.velocity, y })}
      />
    </div>
  );
}

type BodiesPanelProps = {
  bodies: SceneBody[];
  selectedBodyId: string | null;
  onSelectBody: (bodyId: string | null) => void;
  onRemoveBody: (bodyId: string) => void;
  onMassChange: (bodyId: string, mass: number) => void;
  onPositionChange: (bodyId: string, position: Vector) => void;
  onVelocityChange: (bodyId: string, velocity: Vector) => void;
};

/** La lista de cuerpos. Solo la tarjeta del cuerpo elegido está abierta, con sus controles:
 * así el panel es corto y se puede usar sin perder de vista el dibujo. */
export default function BodiesPanel({
  bodies,
  selectedBodyId,
  onSelectBody,
  onRemoveBody,
  onMassChange,
  onPositionChange,
  onVelocityChange,
}: BodiesPanelProps) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface/60 p-4 lg:max-h-[calc(100vh-9rem)] lg:w-80 lg:overflow-y-auto">
      <div className="relative flex items-center justify-between gap-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
          Cuerpos ({bodies.length} de {MAX_BODIES})
        </h2>

        <InfoTip label="Ayuda sobre las unidades y los campos">
          Masas en masas solares. Posiciones y velocidades en unidades de la simulación: la
          Tierra empieza a distancia 1 del Sol y una órbita circular a esa distancia va a
          velocidad 1. En los campos se puede escribir el valor exacto.
        </InfoTip>
      </div>

      <ul className="flex flex-col gap-2">
        {bodies.map((body) => {
          const isSelected = body.id === selectedBodyId;
          const controlsId = `body-controls-${body.id}`;

          return (
            <li
              key={body.id}
              className={`rounded-xl border ${
                isSelected ? "border-accent/50" : "border-border/70"
              }`}
            >
              <div className="flex items-center gap-2 pr-2">
                <button
                  type="button"
                  onClick={() => onSelectBody(isSelected ? null : body.id)}
                  aria-expanded={isSelected}
                  aria-controls={controlsId}
                  className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-3 text-left text-sm text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className={`h-3 w-3 rounded-full ${BODY_COLOR_CLASSES[body.color].swatch}`}
                  />
                  <span className="flex-1">{body.name}</span>
                  <span
                    aria-hidden="true"
                    className={`text-muted transition-transform ${isSelected ? "rotate-90" : ""}`}
                  >
                    ›
                  </span>
                </button>

                {body.isUserAdded && (
                  <button
                    type="button"
                    onClick={() => onRemoveBody(body.id)}
                    aria-label={`Quitar ${body.name}`}
                    className="min-h-9 rounded-full border border-border px-3 text-xs text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                  >
                    Quitar
                  </button>
                )}
              </div>

              {isSelected && (
                <div id={controlsId} className="px-3 pb-3">
                  <BodyControls
                    body={body}
                    onMassChange={onMassChange}
                    onPositionChange={onPositionChange}
                    onVelocityChange={onVelocityChange}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
