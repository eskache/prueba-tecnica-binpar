import OrbitPreview from "@/components/simulacion/OrbitPreview";

export default function SimulacionPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16">
      <OrbitPreview className="h-full max-h-[75vh] w-full max-w-3xl" />
    </section>
  );
}
