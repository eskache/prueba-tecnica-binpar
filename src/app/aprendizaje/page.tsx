import Term from "@/components/Term";
import NextStepButton from "@/components/aprendizaje/NextStepButton";
import SkipIntroButton from "@/components/aprendizaje/SkipIntroButton";

export default function AprendizajePage() {
  return (
    <>
      <SkipIntroButton />

      <section className="relative flex flex-1 items-center justify-center px-6 py-28 sm:px-12">
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

        <NextStepButton />
      </section>
    </>
  );
}
