"use client";

import { useState } from "react";
import Body, { BODY_TEXT_COLORS, type BodyData } from "./Body";
import Formula, { type FormulaOverrides } from "./Formula";
import { LEARNING_STEPS } from "./learningSteps";
import NextStepButton from "./NextStepButton";

export default function LearningExperience() {
  const [stepIndex, setStepIndex] = useState(0);
  const [hoveredBody, setHoveredBody] = useState<BodyData | null>(null);

  const currentStep = LEARNING_STEPS[stepIndex];
  const isLastStep = stepIndex === LEARNING_STEPS.length - 1;

  // Mientras se señala un cuerpo, la fórmula muestra su masa, con su color,
  // en lugar de la "m".
  const formulaOverrides: FormulaOverrides = {};
  if (hoveredBody?.massInKg !== undefined) {
    formulaOverrides.mass = {
      text: `${hoveredBody.massInKg} kg`,
      colorClass: BODY_TEXT_COLORS[hoveredBody.id],
    };
  }

  function goToNextStep() {
    setStepIndex(stepIndex + 1);
  }

  return (
    <section className="relative flex flex-1 items-center justify-center px-6 py-28 sm:px-12">
      <Formula variables={currentStep.formulaVariables} overrides={formulaOverrides} />

      <div className="flex w-fit max-w-3xl flex-col items-center gap-12 sm:flex-row sm:gap-20 lg:gap-24">
        <div className="flex items-center gap-6">
          {currentStep.bodies.map((body) => (
            <Body key={body.id} body={body} onHoverChange={setHoveredBody} />
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
