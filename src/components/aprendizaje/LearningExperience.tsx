"use client";

import { Fragment, useState } from "react";
import Body from "./Body";
import DistanceLine from "./DistanceLine";
import Formula, { type FormulaValues } from "./Formula";
import { GRAVITATIONAL_CONSTANT, LEARNING_STEPS } from "./learningSteps";
import { ScientificNotation } from "./scientificNumber";
import StepNavigation from "./StepNavigation";

export default function LearningExperience() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPointingAtBody, setIsPointingAtBody] = useState(false);
  const [isPointingAtGravity, setIsPointingAtGravity] = useState(false);
  const [isPointingAtDistanceLine, setIsPointingAtDistanceLine] = useState(false);

  const currentStep = LEARNING_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === LEARNING_STEPS.length - 1;

  const formulaValues: FormulaValues = {};

  // Mientras se señala algún cuerpo, la fórmula muestra la masa de cada uno
  // en lugar de m₁ y m₂.
  if (isPointingAtBody) {
    for (const body of currentStep.bodies) {
      if (body.mass) {
        formulaValues[body.mass.variable] = <ScientificNotation {...body.mass.inKg} />;
      }
    }
  }

  // Mientras se señala algún cuerpo o la palabra "gravedad", muestra el valor
  // real de G. Si el paso todavía no tiene G en la fórmula, esto no se ve.
  if (isPointingAtBody || isPointingAtGravity) {
    formulaValues.constant = <ScientificNotation {...GRAVITATIONAL_CONSTANT} />;
  }

  // Mientras se señala la línea que une los cuerpos, muestra el valor de la r.
  if (isPointingAtDistanceLine && currentStep.distanceInMeters) {
    formulaValues.distance = <ScientificNotation {...currentStep.distanceInMeters} />;
  }

  function goToPreviousStep() {
    setStepIndex(stepIndex - 1);
  }

  function goToNextStep() {
    setStepIndex(stepIndex + 1);
  }

  return (
    // En móvil hay más relleno arriba que abajo: la fórmula ocupa la parte de
    // arriba y, si no, en pantallas bajas se solaparía con los cuerpos.
    <section className="relative flex flex-1 items-center justify-center px-6 pb-24 pt-40 sm:px-12 sm:py-28">
      <Formula parts={currentStep.formulaParts} values={formulaValues} />

      <div className="flex w-fit max-w-3xl flex-col items-center gap-12 sm:flex-row sm:gap-20 lg:gap-24">
        <div className="flex items-center gap-6">
          {currentStep.bodies.map((body, index) => (
            <Fragment key={body.id}>
              {/* La línea de distancia va entre el primer cuerpo y el segundo. */}
              {index > 0 && currentStep.distanceInMeters && (
                <DistanceLine
                  inMeters={currentStep.distanceInMeters}
                  onHoverChange={setIsPointingAtDistanceLine}
                />
              )}
              <Body body={body} onHoverChange={setIsPointingAtBody} />
            </Fragment>
          ))}
        </div>

        {/* El texto cambia sin navegar a otra página: aria-live hace que se anuncie. */}
        <div aria-live="polite" className="max-w-xl">
          <p
            key={stepIndex}
            className="text-center text-2xl leading-relaxed text-foreground motion-safe:animate-fade-in sm:text-left sm:text-3xl"
          >
            {currentStep.text({ onGravityHover: setIsPointingAtGravity })}
          </p>
        </div>
      </div>

      <StepNavigation
        onPrevious={goToPreviousStep}
        onNext={goToNextStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </section>
  );
}
