const PREVIOUS_BUTTON_CLASSES =
  "inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted transition-colors enabled:hover:border-accent/60 enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40";

const NEXT_BUTTON_CLASSES =
  "inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-3 text-sm font-medium text-accent transition-colors enabled:hover:bg-accent enabled:hover:text-background disabled:cursor-not-allowed disabled:opacity-40";

const ARROW_PATHS = {
  left: "M19 12H5M11 6l-6 6 6 6",
  right: "M5 12h14M13 6l6 6-6 6",
};

function ArrowIcon({ direction }: { direction: keyof typeof ARROW_PATHS }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ARROW_PATHS[direction]} />
    </svg>
  );
}

type StepNavigationProps = {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function StepNavigation({
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
}: StepNavigationProps) {
  return (
    <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className={PREVIOUS_BUTTON_CLASSES}
      >
        <ArrowIcon direction="left" />
        Anterior
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastStep}
        className={NEXT_BUTTON_CLASSES}
      >
        Siguiente
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
