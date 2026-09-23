"use client";

import { useState } from "react";
import Formula from "./Formula";
import { LEARNING_STEPS } from "./learningSteps";
import NextStepButton from "./NextStepButton";

export default function LearningExperience() {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = LEARNING_STEPS[stepIndex];
  const isLastStep = stepIndex === LEARNING_STEPS.length - 1;

  function goToNextStep() {
    setStepIndex(stepIndex + 1);
  }

  return (
    <section className="relative flex flex-1 items-center justify-center px-6 py-28 sm:px-12">
      <Formula variables={currentStep.formulaVariables} />

      <div className="flex w-fit max-w-3xl flex-col items-center gap-12 sm:flex-row sm:gap-20 lg:gap-24">
        <div
          aria-hidden="true"
          className="h-28 w-28 shrink-0 rounded-full bg-accent shadow-glow motion-safe:animate-float sm:h-40 sm:w-40"
        />

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
