"use client";

import { Fragment, useState } from "react";
import Body, { type BodyData } from "./Body";
import DistanceLine from "./DistanceLine";
import FinalStep from "./FinalStep";
import Formula, { type FormulaValues } from "./Formula";
import OrbitScene from "@/components/simulacion/OrbitScene";
import {
  SUN_AND_EARTH_PREDICTION_DURATION,
  SUN_AND_EARTH_VIEW_RADIUS,
  THREE_BODY_SYSTEM,
  THREE_BODY_VIEW_RADIUS,
  TWO_BODY_SYSTEM,
} from "@/components/simulacion/sceneBodies";
import { GRAVITATIONAL_CONSTANT, LEARNING_STEPS } from "./learningSteps";
import { ScientificNotation } from "./scientificNumber";
import SkipIntroButton from "./SkipIntroButton";
import StepNavigation from "./StepNavigation";

export default function LearningExperience() {
  const [stepIndex, setStepIndex] = useState(0);
  const [pointedBodyId, setPointedBodyId] = useState<BodyData["id"] | null>(null);
  const [isPointingAtGravity, setIsPointingAtGravity] = useState(false);
  const [isPointingAtDistanceLine, setIsPointingAtDistanceLine] = useState(false);

  const currentStep = LEARNING_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === LEARNING_STEPS.length - 1;

  const formulaValues: FormulaValues = {};

  // Mientras se señala un cuerpo, la fórmula muestra su masa en lugar de su
  // m₁ o m₂; la del otro cuerpo no cambia.
  const pointedBody = currentStep.bodies.find((body) => body.id === pointedBodyId);
  if (pointedBody?.mass) {
    formulaValues[pointedBody.mass.variable] = <ScientificNotation {...pointedBody.mass.inKg} />;
  }

  // Mientras se señala la palabra "gravedad", muestra el valor real de G.
  // Si el paso todavía no tiene G en la fórmula, esto no se ve.
  if (isPointingAtGravity) {
    formulaValues.constant = <ScientificNotation {...GRAVITATIONAL_CONSTANT} />;
  }

  // Mientras se señala la línea que une los cuerpos, muestra el valor de r,
  // entre paréntesis y elevado al cuadrado como en la fórmula.
  if (isPointingAtDistanceLine && currentStep.distanceInMeters) {
    formulaValues.distance = (
      <>
        (<ScientificNotation {...currentStep.distanceInMeters} />)<sup>2</sup>
      </>
    );
  }

  function goToPreviousStep() {
    setStepIndex(stepIndex - 1);
  }

  function goToNextStep() {
    setStepIndex(stepIndex + 1);
  }

  function skipToLastStep() {
    setStepIndex(LEARNING_STEPS.length - 1);
  }

  return (
    // En móvil hay más relleno arriba que abajo: la fórmula ocupa la parte de
    // arriba y, si no, en pantallas bajas se solaparía con los cuerpos.
    <section className="relative flex flex-1 items-center justify-center px-6 pb-24 pt-40 sm:px-12 sm:py-28">
      {/* En el último paso ya no hay introducción que saltar. */}
      {!isLastStep && <SkipIntroButton onSkip={skipToLastStep} />}

      <Formula parts={currentStep.formulaParts} values={formulaValues} />

      {currentStep.isFinalStep ? (
        <FinalStep>{currentStep.text({ onGravityHover: setIsPointingAtGravity })}</FinalStep>
      ) : (
        <div className="flex w-fit max-w-3xl flex-col items-center gap-12 sm:flex-row sm:gap-20 lg:gap-24">
          {currentStep.showsOrbitSimulation ? (
            // El key hace que al pasar de dos a tres cuerpos la escena empiece de nuevo.
            <OrbitScene
              key={currentStep.hasThirdBody ? "three-bodies" : "two-bodies"}
              initialBodies={currentStep.hasThirdBody ? THREE_BODY_SYSTEM : TWO_BODY_SYSTEM}
              draggableBodies={["earth"]}
              // Con tres cuerpos, la Tierra pasa cerca del tercero enseguida: si la
              // predicción se parase ahí (como con dos cuerpos, para no seguir tras un
              // choque real), el contorno se vería cortado y no se notaría el caos.
              stopsOnCollision={!currentStep.hasThirdBody}
              predictionDuration={SUN_AND_EARTH_PREDICTION_DURATION}
              viewRadius={currentStep.hasThirdBody ? THREE_BODY_VIEW_RADIUS : SUN_AND_EARTH_VIEW_RADIUS}
              className="size-40 shrink-0 motion-safe:animate-fade-in sm:size-96"
            />
          ) : (
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
                  <Body
                    body={body}
                    onHoverChange={(isHovered) => setPointedBodyId(isHovered ? body.id : null)}
                  />
                </Fragment>
              ))}
            </div>
          )}

          {/* El texto cambia sin navegar a otra página: aria-live hace que se anuncie. */}
          <div aria-live="polite" className="max-w-xl">
            <p
              key={stepIndex}
              className="text-center text-xl leading-snug text-foreground motion-safe:animate-fade-in sm:text-left sm:text-3xl sm:leading-relaxed"
            >
              {currentStep.text({ onGravityHover: setIsPointingAtGravity })}
            </p>
          </div>
        </div>
      )}

      <StepNavigation
        onPrevious={goToPreviousStep}
        onNext={goToNextStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </section>
  );
}
