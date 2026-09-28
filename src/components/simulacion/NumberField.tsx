import { useState } from "react";

type NumberFieldProps = {
  /** El valor actual. */
  value: number;
  /** Cómo se escribe el valor cuando no se está editando. */
  format: (value: number) => string;
  /** El nombre completo para lectores de pantalla, p. ej. "Masa de la Tierra". */
  ariaLabel: string;
  /** Los límites: lo que se escriba fuera de ellos se ajusta al más cercano. */
  min: number;
  max: number;
  onCommit: (value: number) => void;
};

/** Un campo para escribir un valor exacto, que acepta coma o punto decimal y notación
 * científica (3e-6). Mientras se escribe, se muestra el texto tal cual y el valor se
 * aplica en cuanto es un número válido; al salir del campo vuelve a mostrarse el valor
 * real, ya ajustado a los límites. */
export default function NumberField({
  value,
  format,
  ariaLabel,
  min,
  max,
  onCommit,
}: NumberFieldProps) {
  // El texto que el usuario está escribiendo; null cuando no está editando.
  const [draft, setDraft] = useState<string | null>(null);

  function handleChange(text: string) {
    setDraft(text);

    const typedValue = Number(text.replace(",", "."));
    if (text.trim() === "" || !Number.isFinite(typedValue)) return;

    onCommit(Math.min(Math.max(typedValue, min), max));
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={draft ?? format(value)}
      onChange={(event) => handleChange(event.target.value)}
      onBlur={() => setDraft(null)}
      aria-label={ariaLabel}
      className="w-24 rounded-md border border-border bg-transparent px-2 py-1 text-right text-xs text-foreground"
    />
  );
}
