type SkipIntroButtonProps = {
  onSkip: () => void;
};

export default function SkipIntroButton({ onSkip }: SkipIntroButtonProps) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="fixed right-4 top-4 z-40 rounded-full border border-border bg-surface/80 px-4 py-2 text-xs font-medium text-muted backdrop-blur transition-colors hover:border-accent/60 hover:text-foreground sm:right-8 sm:top-6"
    >
      Ya sé esto, saltar introducción
    </button>
  );
}
