import type { ReactNode } from "react";

type LabeledSliderProps = {
  /** El nombre del valor que controla, p. ej. "Masa". */
  label: string;
  /** El campo donde se puede escribir el valor exacto. */
  field: ReactNode;
  /** Lo que se dice en voz alta al leer el slider, sin la etiqueta. */
  spokenValue: string;
  /** El nombre completo para lectores de pantalla, p. ej. "Masa de la Tierra". */
  ariaLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

/** Un slider con su etiqueta y su valor actual a la vista. */
export default function LabeledSlider({
  label,
  field,
  spokenValue,
  ariaLabel,
  min,
  max,
  step,
  value,
  onChange,
}: LabeledSliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <span>{label}</span>
        {field}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={ariaLabel}
        aria-valuetext={spokenValue}
        className="w-full accent-accent"
      />
    </div>
  );
}
