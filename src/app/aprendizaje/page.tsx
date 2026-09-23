import Term from "@/components/Term";
import GravitySimulationLoader from "@/components/aprendizaje/GravitySimulationLoader";
import LawStep from "@/components/aprendizaje/LawStep";
import Reveal from "@/components/aprendizaje/Reveal";
import ScrollCue from "@/components/aprendizaje/ScrollCue";
import SkipIntroButton from "@/components/aprendizaje/SkipIntroButton";
import { LAW_STEPS } from "./lawSteps";

export default function AprendizajePage() {
  return (
    <>
      <SkipIntroButton />

      <section
        aria-label="Paso 1: cuerpo"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 sm:px-12"
      >
        <div className="flex w-fit max-w-3xl flex-col items-center gap-12 sm:flex-row sm:gap-20 lg:gap-24">
          <div
            aria-hidden="true"
            className="h-28 w-28 shrink-0 rounded-full bg-accent shadow-[0_0_60px_10px_var(--accent-soft)] sm:h-40 sm:w-40"
          />

          <p className="max-w-xl text-center text-2xl leading-relaxed text-foreground sm:text-left sm:text-3xl">
            Esto es un{" "}
            <Term
              word="cuerpo"
              definition="En física, un cuerpo es cualquier objeto con masa: un planeta, una estrella, una pelota. Es el protagonista de la gravitación: dos cuerpos con masa siempre se atraen entre sí."
            />
            .
          </p>
        </div>

        <ScrollCue />
      </section>

      {LAW_STEPS.map((step) => (
        <LawStep key={step.id} {...step} />
      ))}

      <section
        id="simulacion"
        aria-label="Simulación"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-24 sm:px-12"
      >
        <Reveal className="flex w-full flex-col items-center gap-10 text-center">
          <div className="max-w-xl">
            <h2 className="text-2xl leading-snug text-foreground sm:text-3xl">
              Ya conoces las piezas. Ahora muévelas tú.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Añade cuerpos, cambia sus masas y arrástralos: verás cómo cambia
              la atracción entre ellos.
            </p>
          </div>

          <GravitySimulationLoader />
        </Reveal>
      </section>
    </>
  );
}
