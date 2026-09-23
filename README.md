# Gravitación universal · Binpar

Aplicación web que enseña la ley de gravitación universal de Newton (Parte A) y una
galería de soluciones del problema de los tres cuerpos (Parte B), en la misma app,
separadas por pestañas en la barra superior.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La raíz (`/`) redirige a `/aprendizaje`.

## Stack

TypeScript · Next.js (App Router) · Tailwind CSS v4 · npm · Vitest (motor de física).

## Cómo ejecutar los tests

```bash
npm test
```

Cubren el motor de simulación (`src/lib/simulation/engine.ts`): conservación del
momento en un sistema aislado, dirección correcta de la atracción, y que no explota
numéricamente cuando dos cuerpos casi se solapan.

## Decisiones técnicas

- **Server Components por defecto, Client Components solo donde hace falta estado o
  eventos del navegador** (`TopBar`, `Term`, la simulación). Minimiza el JS enviado
  al cliente.
- **Rutas de carpeta como pestañas** (`/aprendizaje`, `/galeria`) en vez de estado en
  memoria, para que la Parte B pueda tener URL propia por solución sin refactor
  (`/galeria/[slug]`).
- **Tokens de diseño vía CSS custom properties + `@theme inline` de Tailwind v4**
  (`src/app/globals.css`), en vez de colores sueltos en componentes.
- Tema oscuro fijo (no conmutable): es parte de la identidad visual pedida, no un
  "modo oscuro" opcional.
- **Motor de N cuerpos genérico** (`src/lib/simulation/engine.ts`), integración de
  Verlet por velocidad (leapfrog) en vez de Euler explícito: mismo coste, pero
  conserva la energía del sistema en vez de que las órbitas se degraden con el
  tiempo. Con "suavizado" (`r² + ε²`) para no dividir por cero cuando dos cuerpos casi
  se solapan. Este mismo motor está pensado para reutilizarse en la Parte B,
  alimentado con las condiciones iniciales de cada una de las seis soluciones.
- La constante gravitatoria y el suavizado (`DEFAULT_SIMULATION_CONFIG`) son valores
  ajustados para que el movimiento se vea bien en un lienzo de cientos de píxeles, no
  el valor físico real de G — a esa escala sería imperceptible.
- El bucle de animación vive en un `ref` (`useOrbitSimulation`), no en estado de
  React: el `<canvas>` se pinta de forma imperativa a 60fps y React solo se entera de
  los cambios que importan a la UI (añadir/quitar cuerpo, masa).
- El `<canvas>` de la simulación se carga con `next/dynamic(..., { ssr: false })`
  desde un wrapper cliente (`GravitySimulationLoader`): no aporta nada renderizarlo en
  servidor, y `ssr: false` solo es válido dentro de un Client Component en Next 16.

## Alcance de la simulación interactiva (v1)

- Añadir cuerpo: clic en hueco vacío del lienzo, o el botón "Añadir cuerpo"
  (accesible por teclado). Tope de 6 cuerpos — límite pedagógico, no de rendimiento.
- Arrastrar un cuerpo lo reposiciona y resetea su velocidad a cero (no se puede fijar
  velocidad inicial en esta versión: un cuerpo nuevo siempre cae en línea recta hacia
  los demás, no entra en órbita). Ver "por dónde puede crecer" más abajo.
- Masa y quitar cuerpo: siempre mediante controles reales (`<input type="range">`,
  `<button>`), no solo mediante el lienzo — así son operables por teclado aunque
  arrastrar en el canvas no lo sea.

### Por dónde puede crecer

- Velocidad inicial editable (arrastrar-y-soltar tipo tirachinas) en vez de siempre
  cero, para poder generar órbitas en vez de solo caídas directas.
- Fusión/colisión de cuerpos: hoy, si se solapan, el suavizado simplemente evita que
  la fuerza se dispare a infinito; no se fusionan ni conservan momento combinado.
- Reposicionar un cuerpo por teclado (hoy el arrastre es solo ratón/táctil).

## Limitaciones conocidas / pendiente

- El componente `Term` (palabra con definición al hover) solo se activa con
  `hover`/`focus`. En pantallas táctiles no hay hover real, así que en móvil el
  usuario puede no llegar a ver la definición. Pendiente: añadir un `onClick`/tap que
  alterne el tooltip como fallback táctil.
- `Term` usa `role="button"` en el span disparador sin tener una acción asociada
  (no hay `onClick`/`onKeyDown`), lo que un lector de pantalla anuncia como "botón"
  de forma engañosa. Pendiente: quitar el rol y dejar solo `tabIndex` +
  `aria-describedby`, que es el patrón correcto para texto con descripción adjunta.
- La Parte A es una sola pantalla, sin scroll: se avanza con el botón "Siguiente".
  Ese botón y "Saltar introducción" son solo visuales por ahora, y todavía no hay un
  segundo paso al que avanzar.
- La simulación (motor, hook y componente) está construida y probada, pero no se
  muestra en ninguna página: se montará como uno de los pasos cuando existan.
