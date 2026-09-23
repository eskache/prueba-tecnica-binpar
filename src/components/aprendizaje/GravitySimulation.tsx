"use client";

import { useEffect, useRef, useState } from "react";
import { createBody, MAX_BODIES, useOrbitSimulation } from "@/lib/simulation/useOrbitSimulation";
import type { Body, Vector2 } from "@/lib/simulation/engine";

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 500;
const MIN_MASS = 5;
const MAX_MASS = 100;
const DEFAULT_NEW_MASS = 25;

function radiusForMass(mass: number) {
  return 9 + Math.sqrt(mass) * 1.9;
}

function initialBodies(): Body[] {
  return [
    createBody({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }, 90, { x: 0, y: 0 }),
    createBody({ x: WORLD_WIDTH / 2 + 220, y: WORLD_HEIGHT / 2 }, 18, { x: 0, y: -50 }),
  ];
}

export default function GravitySimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const accentColorRef = useRef("#f5a524");
  const [bodies] = useState<Body[]>(initialBodies);
  const {
    bodiesRef,
    summaries,
    addBody,
    removeBody,
    setMass,
    setPosition,
    startDrag,
    endDrag,
  } = useOrbitSimulation(bodies);

  const dragTarget = useRef<string | null>(null);
  const atCapacity = summaries.length >= MAX_BODIES;

  useEffect(() => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (accent) accentColorRef.current = accent;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WORLD_WIDTH * dpr;
    canvas.height = WORLD_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      for (const body of bodiesRef.current) {
        const r = radiusForMass(body.mass);
        ctx.save();
        ctx.shadowBlur = 24;
        ctx.shadowColor = accentColorRef.current;
        ctx.fillStyle = accentColorRef.current;
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [bodiesRef]);

  function worldPointFromEvent(e: React.PointerEvent<HTMLCanvasElement>): Vector2 {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * WORLD_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * WORLD_HEIGHT,
    };
  }

  function bodyAtPoint(point: Vector2) {
    return bodiesRef.current.find((body) => {
      const dx = body.position.x - point.x;
      const dy = body.position.y - point.y;
      return Math.hypot(dx, dy) <= radiusForMass(body.mass) + 6;
    });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const point = worldPointFromEvent(e);
    const hit = bodyAtPoint(point);

    if (hit) {
      dragTarget.current = hit.id;
      startDrag(hit.id);
      canvasRef.current?.setPointerCapture(e.pointerId);
      return;
    }

    addBody(point, DEFAULT_NEW_MASS);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragTarget.current) return;
    const point = worldPointFromEvent(e);
    point.x = Math.min(WORLD_WIDTH, Math.max(0, point.x));
    point.y = Math.min(WORLD_HEIGHT, Math.max(0, point.y));
    setPosition(dragTarget.current, point);
  }

  function handlePointerUp() {
    if (dragTarget.current) {
      endDrag();
      dragTarget.current = null;
    }
  }

  function handleAddBodyButton() {
    addBody(
      { x: WORLD_WIDTH / 2 + (Math.random() - 0.5) * 200, y: WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 150 },
      DEFAULT_NEW_MASS,
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Simulación interactiva de gravitación. Arrastra los cuerpos para moverlos, o toca un hueco vacío para añadir uno nuevo."
        style={{ aspectRatio: `${WORLD_WIDTH} / ${WORLD_HEIGHT}`, touchAction: "none" }}
        className="w-full rounded-2xl border border-border bg-surface"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleAddBodyButton}
          disabled={atCapacity}
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Añadir cuerpo
        </button>
        <p className="text-xs text-muted">
          {summaries.length} / {MAX_BODIES} cuerpos
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {summaries.map((body, index) => (
          <li
            key={body.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3"
          >
            <span className="w-16 shrink-0 text-sm text-muted">
              Cuerpo {index + 1}
            </span>
            <input
              type="range"
              min={MIN_MASS}
              max={MAX_MASS}
              value={body.mass}
              onChange={(e) => setMass(body.id, Number(e.target.value))}
              aria-label={`Masa del cuerpo ${index + 1}`}
              className="h-1.5 flex-1 accent-accent"
            />
            <span className="w-10 shrink-0 text-right text-sm text-muted">
              {Math.round(body.mass)}
            </span>
            <button
              type="button"
              onClick={() => removeBody(body.id)}
              disabled={summaries.length <= 1}
              aria-label={`Quitar cuerpo ${index + 1}`}
              className="shrink-0 rounded-full px-2 py-1 text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
