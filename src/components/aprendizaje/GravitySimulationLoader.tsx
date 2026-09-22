"use client";

import dynamic from "next/dynamic";

// La simulación es un <canvas> con un bucle de animación e interacción de
// puntero: no aporta nada renderizarla en servidor, así que se carga solo en
// cliente. `ssr: false` únicamente es válido dentro de un Client Component.
const GravitySimulation = dynamic(() => import("./GravitySimulation"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full max-w-3xl items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted"
      style={{ aspectRatio: "800 / 500" }}
    >
      Cargando simulación…
    </div>
  ),
});

export default function GravitySimulationLoader() {
  return <GravitySimulation />;
}
