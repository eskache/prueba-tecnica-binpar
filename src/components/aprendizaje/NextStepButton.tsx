export default function NextStepButton() {
  return (
    <div className="absolute inset-x-0 bottom-8 flex justify-center">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background"
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
