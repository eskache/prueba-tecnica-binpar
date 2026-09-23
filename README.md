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

## Guion de la Parte A

Cuatro pasos en scroll y, al final, la simulación:

1. **Cuerpo** — un cuerpo es cualquier objeto con masa.
2. **Masa** — más masa, más atracción. Aparece la fórmula con la masa encendida.
3. **Distancia** — más cerca, más atracción; al doblar la distancia la fuerza cae a la
   cuarta parte (`r²`). Se enciende la distancia.
4. **Constante universal (G)** — el número fijo que da la escala. La fórmula queda
   completa.
5. **Simulación** — "ya conoces las piezas, ahora muévelas tú".

Decisiones de esta parte:

- **Código de color único** (`src/lib/tones.ts` + tokens en `globals.css`): masa
  (naranja, el mismo de los cuerpos), distancia (azul), constante (violeta). El mismo
  color se usa en la fórmula, su leyenda, las ilustraciones y las palabras con
  definición, de modo que el color enseña qué es cada parte.
- **La fórmula se enciende por pasos**: las partes aún no explicadas quedan apagadas
  y la que se explica ahora lleva un resalte de fondo. Cada paso incluye su propia
  fórmula (estado derivado del paso, sin estado compartido ni observadores) en vez de
  una sola fórmula pegajosa: es más simple, funciona sin JavaScript y cada pantalla se
  entiende por sí sola.
- **`Reveal`**: los pasos aparecen con un fundido al hacer scroll. El contenido llega
  visible desde el servidor y solo se oculta en el cliente si está fuera de pantalla,
  así que sin JS, con `prefers-reduced-motion` o al recargar a mitad de página nunca
  queda nada invisible.
- **Contenido como datos** (`src/app/aprendizaje/lawSteps.tsx`): los pasos 2 a 4 son un
  array que una única plantilla (`LawStep`) pinta.
- La fórmula es HTML/CSS con `role="math"` y una lectura en voz alta (`aria-label`),
  en lugar de una librería de matemáticas: son cuatro símbolos y una fracción.
- **`Term`** funciona con hover, foco, clic o toque (que lo deja fijado) y se cierra
  con Escape o pulsando fuera. Se desplaza lo justo para no salirse de la pantalla en
  móvil.

## Limitaciones conocidas / pendiente

- El botón "saltar introducción" todavía no hace nada (solo está el elemento visual).
- Las ilustraciones de los pasos 2 a 4 son animaciones o dibujos, no interactivas: la
  interacción real está en la simulación final.
- Sin tests de interfaz; los tests cubren la lógica pura del motor de física.
