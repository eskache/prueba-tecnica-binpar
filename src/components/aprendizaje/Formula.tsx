import type { ReactNode } from "react";
import { TONE_CHIP, TONE_DOT, TONE_TEXT, type Tone } from "@/lib/tones";

type FormulaProps = {
  /** Magnitudes ya explicadas: se pintan de su color; el resto queda apagado. */
  lit: readonly Tone[];
  /** La magnitud que se está explicando ahora: lleva además un resalte de fondo. */
  focus?: Tone;
};

type LegendEntry = { tone: Tone | null; symbol: ReactNode; label: string };

const LEGEND: readonly LegendEntry[] = [
  { tone: null, symbol: "F", label: "fuerza de atracción entre los dos cuerpos" },
  {
    tone: "mass",
    symbol: (
      <>
        m<sub>1</sub>, m<sub>2</sub>
      </>
    ),
    label: "masa de cada cuerpo",
  },
  { tone: "distance", symbol: "r", label: "distancia que los separa" },
  { tone: "constant", symbol: "G", label: "constante de gravitación universal" },
];

const SPOKEN_FORMULA =
  "F igual a G por m uno por m dos, dividido entre r al cuadrado";

export default function Formula({ lit, focus }: FormulaProps) {
  function termClass(tone: Tone) {
    const color = lit.includes(tone) ? TONE_TEXT[tone] : "text-dim";
    const chip = tone === focus ? TONE_CHIP[tone] : "";
    return `rounded-xl px-2 transition-colors duration-700 ${color} ${chip}`;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        role="math"
        aria-label={SPOKEN_FORMULA}
        className="inline-flex items-center gap-3 text-5xl font-medium sm:gap-5 sm:text-6xl"
      >
        <span aria-hidden="true" className="text-foreground">
          F
        </span>
        <span aria-hidden="true" className="text-muted">
          =
        </span>
        <span aria-hidden="true" className={termClass("constant")}>
          G
        </span>
        <span
          aria-hidden="true"
          className="inline-flex flex-col items-stretch text-center"
        >
          <span className={termClass("mass")}>
            m<sub>1</sub>m<sub>2</sub>
          </span>
          <span className="my-2 h-0.5 rounded-full bg-muted/60" />
          <span className={termClass("distance")}>
            r<sup>2</sup>
          </span>
        </span>
      </div>

      <ul
        aria-label="Qué significa cada parte de la fórmula"
        className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm sm:text-base"
      >
        {LEGEND.filter(({ tone }) => tone === null || lit.includes(tone)).map(
          ({ tone, symbol, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${tone ? TONE_DOT[tone] : "bg-foreground"}`}
              />
              <span className={tone ? `font-medium ${TONE_TEXT[tone]}` : "font-medium"}>
                {symbol}
              </span>
              <span className="text-muted">{label}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
