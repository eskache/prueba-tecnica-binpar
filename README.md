# Gravitación universal · Binpar

Aplicación web que enseña la ley de gravitación universal de Newton (Parte A, en
`/aprendizaje`) y, dentro de la misma simulación, deja cargar las seis soluciones del
problema de los tres cuerpos (Parte B, en `/simulacion`).

Version Online sin tener que descargar nada -> https://prueba-tecnica-binpar.vercel.app/aprendizaje

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La raíz (`/`) redirige a `/aprendizaje`.

Para que funcionen los botones de preguntas del último paso (integración con un modelo
de lenguaje), copia `.env.example` a `.env.local` y pon ahí una clave gratuita de
[Groq](https://console.groq.com/keys):

```bash
cp .env.example .env.local
```

Sin esa clave, el resto de la aplicación funciona igual; esos botones muestran un error.

## Despliegue

**Versión desplegada:** <https://prueba-tecnica-binpar.vercel.app/aprendizaje>

Recomendado: [Vercel](https://vercel.com), gratis para un proyecto personal. Es la
casa de Next.js, así que no hace falta configuración: detecta el framework, construye
con `next build` y sirve tanto las páginas como la ruta `/api/preguntar` (que necesita
un servidor, no solo archivos estáticos). GitHub Pages no vale para esto: solo sirve
HTML/CSS/JS estáticos, y esa ruta dejaría de funcionar.

1. Entra en [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. "Add New… → Project" y elige este repositorio (`eskache/prueba-tecnica-binpar`).
3. En "Environment Variables", añade `GROQ_API_KEY` con tu clave (y `GROQ_MODEL` si
   quieres otro modelo). Sin esto se despliega igual, pero los botones de preguntas del
   paso final fallan, como en local.
4. "Deploy". Cuando termine, Vercel da la URL pública; se actualiza sola en cada `git
   push` a `main`.

(También se puede hacer con la CLI: `npx vercel` para crear el proyecto y
`npx vercel --prod` para publicar, tras `vercel login`.)

## Stack

TypeScript · Next.js (App Router) · Tailwind CSS v4 · npm · axios (para llamar a Groq).

## Decisiones técnicas

- **Server Components por defecto, Client Components solo donde hace falta estado o
  eventos del navegador** (`Term`, `LearningExperience`). Minimiza el JS enviado al
  cliente.
- **Rutas de carpeta** (`/aprendizaje`, `/simulacion`) en vez de estado en memoria, para
  que una solución de la Parte B tenga URL propia y compartible
  (`/simulacion?solucion=<slug>`) sin más estado que la propia URL. No hay barra de
  navegación: `/aprendizaje` acaba con un botón "Ir a la simulación", y ahí la Parte B es
  una lista de nombres dentro del mismo simulador (`SolutionPicker`), no una galería de
  tarjetas aparte con sus propias páginas de detalle: por decisión de simplificar.
- **Tokens de diseño vía CSS custom properties + `@theme inline` de Tailwind v4**
  (`src/app/globals.css`), en vez de colores sueltos en componentes.
- Tema oscuro fijo (no conmutable): es parte de la identidad visual pedida, no un
  "modo oscuro" opcional.

### La simulación física

Es la pieza que sostiene todo lo demás: el paso 5 y 6 del aprendizaje, la escena de
`/simulacion` con sus controles, y las seis soluciones de la Parte B son la misma
física (`src/physics/simulation.ts`), no tres implementaciones distintas.

- **Cómo funciona.** Son unas 210 líneas de TypeScript puro, sin React ni ninguna
  dependencia: una lista de cuerpos (masa, posición, velocidad, radio) y tres
  operaciones — `stepSystem` avanza un instante con
  [leapfrog](https://en.wikipedia.org/wiki/Leapfrog_integration) (media patada,
  movimiento, otra media patada; ver el comentario junto a la función), `advance`
  encadena los pasos que hagan falta para cubrir una duración, y `predictTrajectories`
  hace lo mismo sobre una copia para dibujar la línea discontinua de la órbita prevista
  sin mover los cuerpos reales. El paso de tiempo no es fijo: es una fracción del
  "tiempo de caída" de la pareja de cuerpos más próxima (`timeStepFor`), con un máximo
  cuando están lejos. Con un paso fijo, cuatro de las seis soluciones de la galería (los
  cuerpos llegan a pasar a 0,01 unidades unos de otros) se desviaban o salían disparadas;
  con el paso adaptable se cierran tras un periodo con un error de alrededor de 0,01.
- **El marco de dibujo se ajusta solo.** `OrbitScene` no usa el `viewRadius` que le pasan
  a secas: lo agranda (hasta un máximo) si la órbita prevista no cabe, que con tres
  cuerpos, o arrastrando, se aleja mucho más que con dos. Si no, quedaría cortada fuera
  del recuadro — el bug que llevó a esto: en el paso del tercer cuerpo, la órbita se veía
  sin terminar. Mientras se arrastra un cuerpo, ese marco se congela en el valor que tenía
  al empezar el gesto: si cambiara con cada movimiento, la conversión de píxeles a
  coordenadas de la escena cambiaría a mitad de arrastre, amplificando el propio gesto —
  un movimiento pequeño del ratón podía disparar la velocidad a la de escape.
- **Por qué no una librería.** Se evaluó y se descartó una librería de física 2D
  (Matter.js, Planck) o de N cuerpos ya hecha. La gravitación de Newton entre puntos es
  un algoritmo pequeño y cerrado — sumar la fuerza de cada pareja, integrar — y una
  librería de física general trae encima colisiones con rebote, fricción, articulaciones
  y cuerpos rígidos: conceptos que no pintan nada aquí y que habría que ignorar o
  desactivar, a cambio de peso en el bundle y una API ajena que aprender y doblegar.
  Además, necesitábamos algo que una librería de física no ofrece de fábrica: "avanza
  esto N unidades de tiempo sobre una copia y dame el camino", para dibujar la órbita
  prevista sin tocar la simulación real. Y necesitábamos poder cambiar el integrador
  (de Euler a leapfrog, ver el comentario en `simulation.ts`) y explicar por qué, que es
  precisamente lo que una librería esconde. El resultado son funciones puras, fáciles de
  probar mentalmente y de reutilizar tal cual en el aprendizaje, en `/simulacion` y en la
  galería.
- **Limitaciones que trae esta decisión.**
  - **Solo 2D.** El botón "Explícame cómo funcionaría en 3D" de la pantalla final admite
    que en 3D no existe: los vectores son `{x, y}` en todo el motor.
  - **Sin física de colisión.** `haveCollided` solo compara distancias para parar la
    simulación (o cortar la órbita prevista); los cuerpos no rebotan ni se fusionan,
    porque nunca hizo falta que lo hicieran.
  - **O(n²) sin optimizar.** Cada cuerpo calcula la fuerza de todos los demás, sin
    ninguna técnica para reducir ese coste (como un árbol Barnes-Hut). Con el máximo de
    5 cuerpos del panel no se nota; con cientos, sí.
  - **Aproximada, no exacta.** Leapfrog no acumula error en cada vuelta como Euler, pero
    sigue siendo una aproximación: las soluciones de la galería se cierran con un error
    de entre 0,001 y 0,07 tras un periodo (comprobado con el propio motor), y no cero.
  - **Todo en el hilo principal.** `predictTrajectories` se recalcula en cada cambio de
    los cuerpos (`useMemo` en `OrbitScene`) de forma síncrona, sin Web Worker: con
    encuentros muy cercanos el paso adaptable se reduce mucho y el cálculo puede notarse
    un instante. No ha llegado a ser un problema con los sistemas de esta app.
