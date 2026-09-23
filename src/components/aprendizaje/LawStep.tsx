import type { ReactNode } from "react";
import type { Tone } from "@/lib/tones";
import Formula from "./Formula";
import Reveal from "./Reveal";

export type LawStepProps = {
  id: string;
  /** Nombre accesible de la sección, p. ej. "Paso 2: masa". */
  label: string;
  visual: ReactNode;
  headline: ReactNode;
  detail: ReactNode;
  /** Magnitudes de la fórmula ya explicadas en este punto. */
  lit: readonly Tone[];
  /** La que se explica en este paso. */
  focus: Tone;
};

export default function LawStep({
  id,
  label,
  visual,
  headline,
  detail,
  lit,
  focus,
}: LawStepProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24 sm:px-12"
    >
      <Reveal className="flex w-full max-w-4xl flex-col items-center gap-16">
        <div className="flex w-full flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-16 lg:gap-24">
          <div className="flex h-44 w-64 shrink-0 items-center justify-center">
            {visual}
          </div>

          <div className="max-w-md text-center sm:text-left">
            <p className="text-2xl leading-snug text-foreground sm:text-3xl">
              {headline}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {detail}
            </p>
          </div>
        </div>

        <Formula lit={lit} focus={focus} />
      </Reveal>
    </section>
  );
}
