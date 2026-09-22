import Term from "@/components/Term";

export default function AprendizajePage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16 sm:px-12">
      <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-12 sm:grid-cols-[auto_1fr] sm:gap-20 lg:gap-28">
        <div
          aria-hidden="true"
          className="h-28 w-28 shrink-0 justify-self-center rounded-full bg-accent shadow-[0_0_60px_10px_var(--accent-soft)] sm:h-40 sm:w-40 sm:justify-self-start"
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
    </section>
  );
}
