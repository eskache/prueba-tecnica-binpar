type NextStepButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export default function NextStepButton({ onClick, disabled }: NextStepButtonProps) {
  return (
    <div className="absolute inset-x-0 bottom-8 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-3 text-sm font-medium text-accent transition-colors enabled:hover:bg-accent enabled:hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente
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
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
