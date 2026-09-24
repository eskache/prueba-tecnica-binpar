import Link from "next/link";
import type { ReactNode } from "react";

// Preguntas que, más adelante, se le harán al modelo de lenguaje. Por ahora los
// botones solo están dibujados: todavía no hacen nada.
const QUESTIONS = [
  "Explícame cómo funcionaría en 3D",
  "Cuéntame más sobre la historia de la ley de gravitación universal",
  "¿Dónde vemos tres cuerpos en la vida real?",
];

const QUESTION_BUTTON_CLASSES =
  "rounded-full border border-border px-4 py-2 text-sm text-foreground sm:px-5 sm:py-2.5 transition-colors hover:border-accent/60 hover:text-accent";

const SIMULATION_LINK_CLASSES =
  "inline-flex items-center rounded-full border border-accent/60 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background";

type FinalStepProps = {
  /** La pregunta grande con la que acaba la experiencia. */
  children: ReactNode;
};

/** La pantalla final: preguntas para seguir aprendiendo, el reto y el paso a la simulación. */
export default function FinalStep({ children }: FinalStepProps) {
  return (
    <div className="flex max-w-3xl flex-col items-center gap-5 motion-safe:animate-fade-in sm:gap-12 sm:pt-10">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {QUESTIONS.map((question) => (
          <button key={question} type="button" className={QUESTION_BUTTON_CLASSES}>
            {question}
          </button>
        ))}
      </div>

      {/* El texto cambia sin navegar a otra página: aria-live hace que se anuncie. */}
      <div aria-live="polite">
        <p className="text-center text-xl leading-snug text-foreground sm:text-4xl sm:leading-relaxed">
          {children}
        </p>
      </div>

      <Link href="/simulacion" className={SIMULATION_LINK_CLASSES}>
        Ir a la simulación
      </Link>
    </div>
  );
}
