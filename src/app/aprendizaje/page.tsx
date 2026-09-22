import Term from "@/components/Term";

export default function AprendizajePage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
      <div className="flex w-full max-w-3xl flex-col items-center gap-10 sm:flex-row sm:gap-14">
        <div
          aria-hidden="true"
          className="h-28 w-28 shrink-0 rounded-full bg-accent shadow-[0_0_60px_10px_var(--accent-soft)] sm:h-36 sm:w-36"
        />

        <p className="text-center text-2xl leading-relaxed text-foreground sm:text-left sm:text-3xl">
          Esto es un{" "}
          <Term
            word="cuerpo"
            definition="En física, un cuerpo es cualquier objeto con masa: un planeta, una estrella, una pelota. Es el protagonista de la gravitación: dos cuerpos con masa siempre se atraen entre sí."
          />
          .
        </p>
      </div>
    </section>
  );
}
