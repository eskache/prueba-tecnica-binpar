const PLAY_BUTTON_CLASSES =
  "inline-flex min-h-11 items-center rounded-full border border-accent/60 px-3 text-sm sm:px-5 font-medium text-accent transition-colors hover:bg-accent hover:text-background";

const SECONDARY_BUTTON_CLASSES =
  "inline-flex min-h-11 items-center rounded-full border border-border px-3 text-sm sm:px-5 font-medium text-muted transition-colors enabled:hover:border-accent/60 enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40";

type SimulationControlsProps = {
  isRunning: boolean;
  canAddBody: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onAddBody: () => void;
};

/** Los botones para reproducir, pausar y reiniciar la simulación y para añadir cuerpos. */
export default function SimulationControls({
  isRunning,
  canAddBody,
  onToggleRunning,
  onReset,
  onAddBody,
}: SimulationControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
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
  );
}
