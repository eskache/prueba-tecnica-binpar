export default function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-muted"
    >
      <span className="text-xs font-medium uppercase tracking-[0.2em]">
        Sigue bajando
      </span>
      <svg
        className="h-5 w-5 animate-scroll-cue"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
