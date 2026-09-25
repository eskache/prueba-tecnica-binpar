import OrbitScene from "@/components/simulacion/OrbitScene";
import { TWO_BODY_SYSTEM } from "@/components/simulacion/sceneBodies";

export default function SimulacionPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16">
      <OrbitScene
        initialBodies={TWO_BODY_SYSTEM}
        draggableBodies="all"
        isPlayable
        className="size-[min(60vh,40rem)]"
      />
    </section>
  );
}
