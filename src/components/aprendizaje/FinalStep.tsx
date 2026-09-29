"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { LLM_QUESTIONS } from "@/lib/questions";

const QUESTION_BUTTON_CLASSES =
  "rounded-full border px-4 py-2 text-sm transition-colors sm:px-5 sm:py-2.5";
const QUESTION_BUTTON_IDLE_CLASSES =
  "border-border text-foreground hover:border-accent/60 hover:text-accent";
const QUESTION_BUTTON_SELECTED_CLASSES = "border-accent/60 bg-accent/10 text-accent";

const SIMULATION_LINK_CLASSES =
  "inline-flex items-center rounded-full border border-accent/60 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background";

type FinalStepProps = {
  /** La pregunta grande con la que acaba la experiencia. */
  children: ReactNode;
};

/** La pantalla final: preguntas para seguir aprendiendo (contestadas por un modelo de
 * lenguaje), el reto y el paso a la simulación. */
export default function FinalStep({ children }: FinalStepProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function askQuestion(question: string) {
    setSelectedQuestion(question);
    setAnswer(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/preguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      setAnswer(data.answer);
    } catch {
      setError("No se ha podido obtener respuesta. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex max-w-3xl flex-col items-center gap-5 motion-safe:animate-fade-in sm:gap-12 sm:pt-10">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {LLM_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => askQuestion(question)}
            aria-pressed={question === selectedQuestion}
            className={`${QUESTION_BUTTON_CLASSES} ${
              question === selectedQuestion
                ? QUESTION_BUTTON_SELECTED_CLASSES
                : QUESTION_BUTTON_IDLE_CLASSES
            }`}
          >
            {question}
          </button>
        ))}
      </div>

      {/* La respuesta del modelo cambia sin navegar a otra página: aria-live la anuncia. */}
      {selectedQuestion && (
        <div
          aria-live="polite"
          className="max-w-xl rounded-2xl border border-border bg-surface/60 p-4 text-sm leading-relaxed text-foreground"
        >
          {isLoading && <p className="text-muted">Pensando la respuesta…</p>}
          {error && <p className="text-muted">{error}</p>}
          {answer && <p>{answer}</p>}
        </div>
      )}

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
