"use client";

import { useState } from "react";
import Body from "./Body";
import Formula, { type FormulaValues } from "./Formula";
import { LEARNING_STEPS } from "./learningSteps";
import NextStepButton from "./NextStepButton";

export default function LearningExperience() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPointingAtBody, setIsPointingAtBody] = useState(false);

  const currentStep = LEARNING_STEPS[stepIndex];
  const isLastStep = stepIndex === LEARNING_STEPS.length - 1;

  // Mientras se señala algún cuerpo, la fórmula muestra la masa de cada uno
  // en lugar de m₁ y m₂.
  const formulaValues: FormulaValues = {};
  if (isPointingAtBody) {
    for (const body of currentStep.bodies) {
      if (body.mass) {
        formulaValues[body.mass.variable] = `${body.mass.inKg} kg`;
      }
    }
  }

  function goToNextStep() {
    setStepIndex(stepIndex + 1);
  }

  return (
    <section className="relative flex flex-1 items-center justify-center px-6 py-28 sm:px-12">
      <Formula variables={currentStep.formulaVariables} values={formulaValues} />

      <div className="flex w-fit max-w-3xl flex-col items-center gap-12 sm:flex-row sm:gap-20 lg:gap-24">
        <div className="flex items-center gap-6">
          {currentStep.bodies.map((body) => (
            <Body key={body.id} body={body} onHoverChange={setIsPointingAtBody} />
          ))}
        </div>

        {/* El texto cambia sin navegar a otra página: aria-live hace que se anuncie. */}
        <div aria-live="polite" className="max-w-xl">
          <p
            key={stepIndex}
            className="text-center text-2xl leading-relaxed text-foreground motion-safe:animate-fade-in sm:text-left sm:text-3xl"
          >
            {currentStep.text}
          </p>
        </div>
      </div>

      <NextStepButton onClick={goToNextStep} disabled={isLastStep} />
    </section>
  );
}
