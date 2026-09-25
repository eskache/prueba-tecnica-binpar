import {
  ScientificNotation,
  spokenScientificNumber,
  toScientificNumber,
} from "@/components/aprendizaje/scientificNumber";
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
const MASS_EXPONENT_STEP = 0.05;

type SimulationPanelProps = {
  bodies: SceneBody[];
  isRunning: boolean;
  canAddBody: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onAddBody: () => void;
  onMassChange: (bodyId: string, mass: number) => void;
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
  onMassChange,
}: SimulationPanelProps) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-surface/60 p-5 lg:w-72">
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
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          Cuerpos ({bodies.length} de {MAX_BODIES}) · masa en masas solares
        </h2>
        <ul className="flex flex-col gap-4">
          {bodies.map((body) => {
            const mass = toScientificNumber(body.mass);

            return (
              <li key={body.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-3 text-foreground">
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 rounded-full ${BODY_COLOR_CLASSES[body.color].swatch}`}
                    />
                    {body.name}
                  </span>
                  <span className="text-xs text-muted">
                    Masa: <ScientificNotation {...mass} />
                  </span>
                </div>

                <input
                  type="range"
                  min={MIN_MASS_EXPONENT}
                  max={MAX_MASS_EXPONENT}
                  step={MASS_EXPONENT_STEP}
                  value={Math.log10(body.mass)}
                  onChange={(event) => onMassChange(body.id, 10 ** Number(event.target.value))}
                  aria-label={`Masa de ${body.name}`}
                  aria-valuetext={`${spokenScientificNumber(mass)} masas solares`}
                  className="w-full accent-accent"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
