const PLAY_BUTTON_CLASSES =
  "inline-flex items-center rounded-full border border-accent/60 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background";

const RESET_BUTTON_CLASSES =
  "inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:border-accent/60 hover:text-foreground";

type SimulationControlsProps = {
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
};

/** Los botones para poner en marcha, pausar y reiniciar la simulación. */
export default function SimulationControls({
  isRunning,
  onToggleRunning,
  onReset,
}: SimulationControlsProps) {
  return (
    <div className="flex gap-4">
      <button type="button" onClick={onToggleRunning} className={PLAY_BUTTON_CLASSES}>
        {isRunning ? "Pausar" : "Reproducir"}
      </button>
      <button type="button" onClick={onReset} className={RESET_BUTTON_CLASSES}>
        Reiniciar
      </button>
    </div>
  );
}
