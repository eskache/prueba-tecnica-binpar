import { spokenScientificNumber, toScientificNumber } from "@/components/aprendizaje/scientificNumber";
import type { Vector } from "@/physics/simulation";
import LabeledSlider from "./LabeledSlider";
import NumberField from "./NumberField";
import { BODY_COLOR_CLASSES, MAX_BODIES, type SceneBody } from "./sceneBodies";

const PLAY_BUTTON_CLASSES =
  "inline-flex items-center rounded-full border border-accent/60 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background";

const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors enabled:hover:border-accent/60 enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40";

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

type SimulationPanelProps = {
  bodies: SceneBody[];
  isRunning: boolean;
  canAddBody: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onAddBody: () => void;
  onRemoveBody: (bodyId: string) => void;
  onMassChange: (bodyId: string, mass: number) => void;
  onPositionChange: (bodyId: string, position: Vector) => void;
  onVelocityChange: (bodyId: string, velocity: Vector) => void;
};

/** El panel de control de la simulación: reproducir, pausar, reiniciar, añadir cuerpos
 * y la lista de los cuerpos que hay. */
export default function SimulationPanel({
  bodies,
  isRunning,
  canAddBody,
  onToggleRunning,
  onReset,
  onAddBody,
  onRemoveBody,
  onMassChange,
  onPositionChange,
  onVelocityChange,
}: SimulationPanelProps) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-surface/60 p-5 lg:max-h-[calc(100vh-10rem)] lg:w-72 lg:overflow-y-auto">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onToggleRunning} className={PLAY_BUTTON_CLASSES}>
          {isRunning ? "Pausar" : "Reproducir"}
        </button>
        <button type="button" onClick={onReset} className={SECONDARY_BUTTON_CLASSES}>
          Reiniciar
        </button>
        <button
          type="button"
          onClick={onAddBody}
          disabled={!canAddBody}
          className={SECONDARY_BUTTON_CLASSES}
        >
          Añadir cuerpo
        </button>
      </div>

      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
          Cuerpos ({bodies.length} de {MAX_BODIES})
        </h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          Masas en masas solares. Posiciones y velocidades en unidades de la simulación: la
          Tierra empieza a distancia 1 del Sol y una órbita circular a esa distancia va a
          velocidad 1. En los campos se puede escribir el valor exacto.
        </p>

        <ul className="flex flex-col gap-6">
          {bodies.map((body) => {
            const mass = toScientificNumber(body.mass);

            return (
              <li key={body.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3 text-sm text-foreground">
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 rounded-full ${BODY_COLOR_CLASSES[body.color].swatch}`}
                    />
                    {body.name}
                  </span>

                  {body.isUserAdded && (
                    <button
                      type="button"
                      onClick={() => onRemoveBody(body.id)}
                      aria-label={`Quitar ${body.name}`}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                    >
                      Quitar
                    </button>
                  )}
                </div>

                <LabeledSlider
                  label="Masa"
                  field={
                    <NumberField
                      value={body.mass}
                      format={formatMass}
                      ariaLabel={`Masa de ${body.name}, escrita`}
                      min={MIN_MASS}
                      max={MAX_MASS}
                      onCommit={(mass) => onMassChange(body.id, mass)}
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
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
