type SolutionOption = {
  /** null es el sistema de Sol y Tierra con el que empieza la simulación. */
  slug: string | null;
  name: string;
  description: string;
};

type SolutionPickerProps = {
  options: SolutionOption[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
};

/** La lista de sistemas que se pueden cargar en la simulación: el de Sol y Tierra y las
 * soluciones del problema de los tres cuerpos. Debajo se describe el elegido. */
export default function SolutionPicker({ options, selectedSlug, onSelect }: SolutionPickerProps) {
  const selected = options.find((option) => option.slug === selectedSlug);

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-4">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
        Cargar una simulación
      </h2>

      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.slug === selectedSlug;

          return (
            <li key={option.slug ?? "sun-and-earth"}>
              <button
                type="button"
                onClick={() => onSelect(option.slug)}
                aria-pressed={isSelected}
                className={`min-h-9 rounded-full border px-3 text-sm transition-colors ${
                  isSelected
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-border text-muted hover:border-accent/60 hover:text-foreground"
                }`}
              >
                {option.name}
              </button>
            </li>
          );
        })}
      </ul>

      {selected && <p className="text-xs leading-relaxed text-muted">{selected.description}</p>}
    </div>
  );
}
