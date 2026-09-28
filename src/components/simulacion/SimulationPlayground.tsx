"use client";

import { useState } from "react";
import { findSolution, THREE_BODY_SOLUTIONS } from "@/data/threeBodySolutions";
import OrbitScene from "./OrbitScene";
import {
  SUN_AND_EARTH_PREDICTION_DURATION,
  SUN_AND_EARTH_VIEW_RADIUS,
  TWO_BODY_SYSTEM,
} from "./sceneBodies";
import SolutionPicker from "./SolutionPicker";

// Lo primero de la lista es el sistema de Sol y Tierra, con el que empieza la simulación.
const OPTIONS = [
  {
    slug: null,
    name: "Sol y Tierra",
    description: "El Sol y la Tierra, con los que empieza la simulación.",
  },
  ...THREE_BODY_SOLUTIONS.map(({ slug, name, description }) => ({ slug, name, description })),
];

type SimulationPlaygroundProps = {
  /** La solución con la que empieza, si la dirección de la página pedía una. */
  initialSolutionSlug: string | null;
};

/** La simulación con la lista de sistemas que se pueden cargar. La solución elegida queda
 * en la dirección de la página (?solucion=...), para poder compartirla. */
export default function SimulationPlayground({ initialSolutionSlug }: SimulationPlaygroundProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSolutionSlug);
  const solution = selectedSlug === null ? undefined : findSolution(selectedSlug);

  function selectSolution(slug: string | null) {
    setSelectedSlug(slug);

    // Se actualiza la dirección sin recargar la página ni añadir una entrada al historial.
    const url = new URL(window.location.href);
    if (slug === null) {
      url.searchParams.delete("solucion");
    } else {
      url.searchParams.set("solucion", slug);
    }
    window.history.replaceState(null, "", url);
  }

  return (
    <OrbitScene
      // Al cambiar de sistema, la escena empieza de nuevo con sus cuerpos.
      key={selectedSlug ?? "sun-and-earth"}
      initialBodies={solution?.bodies ?? TWO_BODY_SYSTEM}
      draggableBodies="all"
      isPlayable
      // Los cuerpos de las soluciones se acercan mucho entre sí y eso es normal.
      stopsOnCollision={solution === undefined}
      predictionDuration={solution?.period ?? SUN_AND_EARTH_PREDICTION_DURATION}
      viewRadius={solution?.viewRadius ?? SUN_AND_EARTH_VIEW_RADIUS}
      panelHeader={
        <SolutionPicker options={OPTIONS} selectedSlug={selectedSlug} onSelect={selectSolution} />
      }
      className="size-[min(34vh,20rem)] lg:size-[min(60vh,40rem)]"
    />
  );
}
