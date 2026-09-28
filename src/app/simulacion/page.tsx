import SimulationPlayground from "@/components/simulacion/SimulationPlayground";
import { findSolution } from "@/data/threeBodySolutions";

export default async function SimulacionPage({ searchParams }: PageProps<"/simulacion">) {
  // ?solucion=butterfly-i abre esa solución. Si no existe, se ignora.
  const { solucion } = await searchParams;
  const requestedSlug = typeof solucion === "string" ? solucion : null;
  const initialSolutionSlug = requestedSlug && findSolution(requestedSlug) ? requestedSlug : null;

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-4 lg:py-16">
      <SimulationPlayground initialSolutionSlug={initialSolutionSlug} />
    </section>
  );
}
