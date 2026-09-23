/** Ilustraciones de los pasos 2 a 4. Son decorativas pero llevan una
 * descripción (`role="img"`) para que el paso también se entienda sin verlas. */

export function MassVisual() {
  return (
    <div
      role="img"
      aria-label="Dos cuerpos: uno grande, m uno, y otro pequeño, m dos. El grande tiene más masa."
      className="flex items-end gap-10"
    >
      <div aria-hidden="true" className="flex flex-col items-center gap-3">
        <span className="h-28 w-28 rounded-full bg-mass shadow-[0_0_60px_10px_var(--accent-soft)]" />
        <span className="text-xl font-medium text-mass">
          m<sub>1</sub>
        </span>
      </div>
      <div aria-hidden="true" className="flex flex-col items-center gap-3">
        <span className="h-12 w-12 rounded-full bg-mass shadow-[0_0_40px_6px_var(--accent-soft)]" />
        <span className="text-xl font-medium text-mass">
          m<sub>2</sub>
        </span>
      </div>
    </div>
  );
}

export function DistanceVisual() {
  return (
    <div
      role="img"
      aria-label="Dos cuerpos que se acercan y se alejan. Cuanto más cerca están, más brillan, porque más fuerte es la atracción."
      className="flex w-64 items-center pl-4"
    >
      <span
        aria-hidden="true"
        className="animate-attraction-glow h-16 w-16 shrink-0 rounded-full bg-mass"
      />
      <span
        aria-hidden="true"
        className="animate-distance-swing relative block h-0 shrink-0 border-t-2 border-dashed border-distance"
      >
        <span className="absolute left-1/2 -top-9 -translate-x-1/2 text-xl font-medium text-distance">
          r
        </span>
      </span>
      <span
        aria-hidden="true"
        className="animate-attraction-glow h-8 w-8 shrink-0 rounded-full bg-mass"
      />
    </div>
  );
}

export function ConstantVisual() {
  return (
    <div
      role="img"
      aria-label="La letra G, la constante de gravitación universal, con un valor aproximado de 6,674 por 10 elevado a menos 11."
      className="flex flex-col items-center gap-4"
    >
      <span
        aria-hidden="true"
        className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-constant text-6xl font-semibold text-constant shadow-[0_0_50px_6px_var(--constant-soft)]"
      >
        G
      </span>
      <span aria-hidden="true" className="text-sm text-muted">
        ≈ 6,674 × 10<sup>−11</sup>
      </span>
    </div>
  );
}
