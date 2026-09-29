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

Para que funcionen los botones de preguntas del último paso (integración con un modelo
de lenguaje), copia `.env.example` a `.env.local` y pon ahí una clave gratuita de
[Groq](https://console.groq.com/keys):

```bash
cp .env.example .env.local
```

Sin esa clave, el resto de la aplicación funciona igual; esos botones muestran un error.

## Stack

TypeScript · Next.js (App Router) · Tailwind CSS v4 · npm · axios (para llamar a Groq).

## Decisiones técnicas

- **Server Components por defecto, Client Components solo donde hace falta estado o
  eventos del navegador** (`TopBar`, `Term`, `LearningExperience`). Minimiza el JS
  enviado al cliente.
- **Rutas de carpeta como pestañas** (`/aprendizaje`, `/galeria`) en vez de estado en
  memoria, para que la Parte B pueda tener URL propia por solución sin refactor
  (`/galeria/[slug]`).
- **Tokens de diseño vía CSS custom properties + `@theme inline` de Tailwind v4**
  (`src/app/globals.css`), en vez de colores sueltos en componentes.
- Tema oscuro fijo (no conmutable): es parte de la identidad visual pedida, no un
  "modo oscuro" opcional.

## Limitaciones conocidas / pendiente

- No hay tests automáticos todavía.
- El componente `Term` (palabra con definición al hover) solo se activa con
  `hover`/`focus`. En pantallas táctiles no hay hover real, así que en móvil el
  usuario puede no llegar a ver la definición. Pendiente: añadir un `onClick`/tap que
  alterne el tooltip como fallback táctil.
- `Term` usa `role="button"` en el span disparador sin tener una acción asociada
  (no hay `onClick`/`onKeyDown`), lo que un lector de pantalla anuncia como "botón"
  de forma engañosa. Pendiente: quitar el rol y dejar solo `tabIndex` +
  `aria-describedby`, que es el patrón correcto para texto con descripción adjunta.
- En pantallas de unos 320px de ancho puede aparecer scroll horizontal, porque el
  botón fijo "Saltar introducción" tiene el texto demasiado largo, y la barra superior
  se parte en dos líneas y queda casi tocando ese botón. A 375px no ocurre.
- El tooltip de `Term` se centra sobre la palabra, pero se desplaza lo justo para no
  salirse de la pantalla, y cerrado no ocupa sitio (`hidden`): un tooltip invisible
  fuera de pantalla bastaba para que toda la página tuviera scroll horizontal.
- La Parte A es una sola pantalla, sin scroll: se avanza con "Siguiente" y se vuelve
  con "Anterior" (desactivados en el último y en el primer paso).
  Los pasos son datos (`learningSteps.tsx`): cada uno trae su texto, los cuerpos que se
  ven y las piezas de la fórmula (variables y operadores, en orden) que ya se han
  explicado, que se muestran arriba. Hoy hay siete pasos (cuerpo, masa, gravedad,
  distancia, velocidad, caos y el final); en el último, "Siguiente" queda desactivado.
- En el paso de la gravedad ("gravedad" en violeta, el color de la constante universal)
  el cuerpo blanco se acerca al naranja, acelerando, en un bucle de 8 segundos: aparece
  lejos con una flecha que señala al naranja, se acerca despacio, se desvanece ya
  cerca y vuelve a empezar. Como al reiniciar es invisible, no se ve ningún salto.
  Con "reducir movimiento" activado no hay animación ni flecha y los cuerpos se
  quedan en su sitio. La fórmula pasa a `G × m₁ × m₂`, y al señalar la palabra
  "gravedad" (con ratón o teclado) la `G` se sustituye por su valor real,
  6,674 × 10⁻¹¹. Para que el texto de un paso pueda avisar de eso a la pantalla, el
  texto es una función que recibe esos avisos, y `Term` acepta un `onHoverChange`.
- En el paso de la distancia ("distancia" en azul, con tooltip) los dos cuerpos
  aparecen separados y entre ellos hay una línea azul, del mismo color. La fórmula
  añade la `r²` bajo la raya de la fracción y, al señalar la línea con ratón o teclado,
  la `r²` se sustituye por su valor al cuadrado, (1,496 × 10¹¹)², donde 1,496 × 10¹¹ m es
  la distancia media entre la Tierra y el Sol.
  La línea es un elemento aparte (`DistanceLine`), con una zona de apuntado más alta
  que el trazo y que se engruesa al señalarla. La palabra "masa" va en blanco, para
  que no se confunda con el azul de la distancia. Cada concepto tiene su color: naranja
  (Sol y `m₁`), blanco (la Tierra, `m₂` y "masa"), violeta (gravedad), azul (distancia),
  verde (velocidad), turquesa (órbita) y rojo (caos). La palabra "gravedad" explica
  también que cuanto más cerca están los cuerpos más fuerte es la atracción.
- En el paso de la masa hay dos cuerpos que, como ejemplo, son el Sol (naranja,
  1,989 × 10³⁰ kg) y la Tierra (blanco, 5,972 × 10²⁴ kg), y la fórmula muestra `m₁`
  (naranja) `×` `m₂` (blanco). Al señalar cualquiera de los dos con el ratón, o al
  enfocarlo con el teclado, solo se sustituye la masa de ese cuerpo (`m₁` para el
  naranja, `m₂` para el blanco) por su valor real en notación científica y sin unidad:
  los kilogramos ya se indican en el tooltip de "masa". La `G` solo se sustituye al
  señalar la palabra "gravedad". Se muestra la masa y no el peso porque `m` es la masa
  (el peso es una fuerza).
- Los tooltips de las palabras explican lo que simbolizan (unidades, qué cuerpo o valor
  representan en la fórmula, por qué `G` tiene ese valor) y evitan repetir lo que otro
  paso ya explica.
- La fórmula se escribe como en los libros: `F = G × (m₁ × m₂) / r²`, con `G` fuera
  multiplicando y `m₁ × m₂` sobre `r²` en una fracción. Cada pieza declara su sitio
  (en línea, numerador o denominador, en `Formula.tsx`), y la fórmula se va formando
  paso a paso: `F = m₁ × m₂`, luego `F = G × m₁ × m₂` y, al llegar `r²`, `m₁ × m₂` pasa
  al numerador. Los lectores de pantalla oyen "dividido entre" en la raya.
- Con valores en la fórmula la letra es más pequeña (para que no se parta en dos
  líneas) y, en móvil, la fórmula es algo menor y va más arriba. Como ocupa la parte de
  arriba, en móvil hay más relleno arriba que abajo y el contenido queda unos 32px por
  debajo del centro; en escritorio sigue exactamente centrado. En 375×667 la fórmula
  queda al menos a 21px de los cuerpos en el paso más apretado (el de la distancia).
  En 320×568, el móvil más pequeño, ese paso ya necesita scroll vertical.
- Los cuerpos del paso de la masa solo responden a hover o foco. En pantallas táctiles
  no hay hover, y tocar un elemento no siempre le da foco (p. ej. en Safari de iOS),
  así que ahí puede no verse la masa.
- Al pasar del paso 1 al 2 aparece un segundo cuerpo y el bloque se recentra, por lo
  que el círculo grande se desplaza un poco hacia la izquierda.
- "Saltar introducción" lleva al último paso (el de las preguntas y la simulación), y
  desaparece en ese paso, igual que "Siguiente".
- En móviles muy cortos (unos 568px de alto) la `m` de la fórmula queda casi pegada al
  contenido, sin llegar a solaparse.
- Simulación (en marcha): `src/physics/simulation.ts` es física pura, sin React, en
  unidades normalizadas (distancia Tierra–Sol = 1, masa del Sol = 1, G = 1).
  `predictTrajectories` adelanta la simulación sobre una copia y devuelve por dónde
  pasará cada cuerpo, y se corta si dos cuerpos chocan, porque cerca de otro cuerpo la
  atracción se dispara. Cada cuerpo lleva su radio y dos cuerpos chocan cuando la
  distancia entre sus centros es menor que la suma de sus radios (pareja por pareja).
  El radio de dibujo sale de la masa (`radiusFromMass`, con la raíz sexta para que
  masas tan distintas se vean todas); la física no sabe de colores ni de nombres.
  Avanza con el método leapfrog y no con el de Euler (que es más
  simple): Euler acumula error en cada vuelta y con la velocidad de una órbita circular
  la distancia al Sol pasaba de 1 a 1,29 en tres vueltas, abriendo la órbita en espiral;
  con leapfrog se mantiene en 1,000. La explicación está en un comentario de
  `simulation.ts`. Comprobado: con velocidad 0,72 el punto más cercano al Sol sale a
  0,351, igual que en la fórmula de la elipse.
  El paso de tiempo no es fijo: es una pequeña fracción del "tiempo de caída" de la pareja
  de cuerpos más próxima (`timeStepFor`), con un máximo de 0,01. Con un paso fijo, las
  órbitas de la galería, en las que los cuerpos llegan a pasar a 0,01 unidades unos de
  otros, se desviaban o los cuerpos salían disparados; con el paso adaptable se cierran
  con un error de alrededor de 0,01 tras varios periodos, y cuando los cuerpos están
  lejos se comporta igual que antes. La órbita prevista guarda un punto cada 0,01
  unidades recorridas (no cada paso) para no generar decenas de miles de puntos.
  `advance` avanza una duración con los pasos que hagan falta y `stopsOnCollision`
  permite a una escena (la galería) dejar que los cuerpos se acerquen sin pararla.
- Datos de la galería (`src/data/threeBodySolutions.ts`): las seis soluciones (Lagrange,
  figura de ocho, Butterfly I, Goggles, Moth I y Yin-Yang I) con sus condiciones
  iniciales, su periodo y sus fuentes (Lagrange 1772; Chenciner y Montgomery 2000, que
  demostraron la figura de ocho que Moore halló en 1993; Šuvakov y Dmitrašinović 2013,
  Phys. Rev. Lett. 110, 114301). Las órbitas numéricas se dan como en esos trabajos:
  posición inicial en línea recta y velocidades (vx, vy), (vx, vy) y (−2vx, −2vy).
  Comprobado con el motor de la propia aplicación: los cuerpos vuelven a su estado
  inicial tras uno y dos periodos con un error de entre 0,001 y 0,01 (Goggles llega a
  0,07 en el segundo). Las condiciones publicadas tienen 5 o 6 cifras, así que la órbita
  no se cierra con más exactitud. Lagrange es inestable con masas iguales: el error
  numérico acaba deshaciéndola, y así se dice en su descripción.
- Soluciones en el simulador: en `/simulacion` hay una lista con los nombres (`SolutionPicker`)
  y, al pulsar uno, se carga esa simulación: "Sol y Tierra" (la de siempre) o una de las
  seis soluciones de tres cuerpos. Al cambiar, la escena empieza de nuevo (`key`), con
  el dibujo ajustado a esa solución (`viewRadius`), su órbita prevista de un periodo
  (`predictionDuration`) y sin parar por choque, porque los cuerpos se acercan mucho.
  Se pueden reproducir, pausar, reiniciar y cambiar masas, posiciones y velocidades como
  en cualquier simulación (así se buscan órbitas propias). La solución elegida queda en
  la dirección (`/simulacion?solucion=butterfly-i`), que se puede compartir: la página la
  lee en el servidor (`searchParams`) y, al elegir otra, se actualiza con
  `history.replaceState` sin recargar. Un nombre que no existe se ignora. No hay una
  galería de tarjetas ni páginas de detalle aparte, por decisión de simplificar.
- Escena de simulación (`OrbitScene`, en `/simulacion`, sin pestaña todavía): el Sol
  (naranja) y la Tierra (blanca), con la simulación en pausa al empezar. Se puede
  arrastrar cualquiera de los dos hacia atrás, como una goma: la velocidad es la
  contraria al arrastre (0,5 de arrastre = velocidad 1, la de la órbita circular;
  máximo 1,6, por encima de la de escape, √2), se dibuja la goma y la órbita prevista de
  cada uno (naranja para el Sol, turquesa para la Tierra) se recalcula en cada
  movimiento. Usa Pointer Events, así que vale también para táctil. Bajo el
  dibujo hay los botones (`SimulationControls`) "Reproducir/Pausar", "Reiniciar" y
  "Añadir cuerpo", y al lado (o debajo, en móvil) el panel de cuerpos (`BodiesPanel`).
  "Reproducir" pone todo en marcha, "Pausar" lo detiene
  donde esté y "Reiniciar" lo devuelve al principio (quitando los añadidos). Cada cuerpo
  añadido es ligero como la Tierra, aparece en uno de tres sitios fijos alrededor del
  Sol (`NEW_BODY_SLOTS`) con la velocidad de una órbita circular, y se puede arrastrar
  como los demás. Hay un máximo de 5 cuerpos. Cada cuerpo tiene un slider
  de masa, con el que se puede cambiar en cualquier momento, también en marcha. Es
  logarítmico (su valor es el exponente, de 10⁻⁶ a 10⁰ masas solares), porque las masas
  van desde millonésimas de la del Sol hasta la del Sol entero y con un slider normal
  quedarían todas pegadas a un extremo. Al cambiar la masa cambia también el radio del
  cuerpo, y con ello cuándo choca. El slider se maneja con las flechas del teclado y
  lee la masa en voz alta. Cada cuerpo tiene también sliders de posición (x e y, de −1,25 a
  1,25, los límites de lo que se dibuja) y de velocidad (x e y, de −2 a 2), que se
  mantienen sincronizados con el arrastre porque todos escriben en el mismo estado del
  cuerpo. Se eligieron las componentes y no rapidez y dirección porque las soluciones de
  tres cuerpos de la galería se dan en componentes. Junto a cada slider hay un campo
  para escribir el valor exacto (`NumberField`): acepta coma o punto decimal y notación
  científica (3e-3), aplica el valor en cuanto es un número válido, lo ajusta a los
  límites al salir del campo y no hace caso a lo que no sea un número. Un slider de
  ratón no puede dar valores como 0,4662 (con unos 250 píxeles solo se pueden elegir
  unos 250 valores), por eso el campo. La galería cargará las condiciones iniciales
  exactas desde datos. Los cuerpos añadidos tienen un botón "Quitar"; el Sol y la
  Tierra no se pueden quitar (solo se reinician). Al quitar uno, su sitio queda libre
  para el siguiente que se añada (el cuerpo nuevo va al final de la lista, así que el
  orden puede quedar como "Cuerpo 3, Cuerpo 5, Cuerpo 4"). Los cuerpos nuevos siempre
  empiezan con la velocidad de una órbita circular alrededor del Sol.
  Usabilidad del panel: es una lista de tarjetas y solo está abierta la del cuerpo elegido
  (el panel es corto), que se resalta con un anillo en el dibujo; se elige pulsando su
  tarjeta o agarrando el cuerpo en el dibujo, y al añadir un cuerpo queda elegido. Las
  unidades y el uso de los campos se explican en un icono "?" (`InfoTip`) que se abre al
  pasar el ratón, al pulsarlo o tocarlo (y se cierra pulsando fuera o con Escape) y al
  enfocarlo con el teclado. En móvil el dibujo y los botones se quedan fijos arriba
  mientras se desplaza el panel, para ver el efecto de cada cambio; los sliders tienen
  una zona táctil alta y un tirador grande, y arrastrar en vertical sobre ellos sigue
  desplazando la página. Los campos usan el teclado normal (el numérico de algunos móviles
  no tiene el signo menos ni la "e"), seleccionan todo al entrar y se confirman con Enter.
  Limitación: la altura de la barra superior cambia si sus pestañas se parten en dos
  líneas; el dibujo fijo se coloca para el caso de dos líneas, así que en pantallas
  anchas (menos de 1024px) queda una pequeña separación de unos 20px bajo ella.
  Con la simulación en marcha no se dibujan las órbitas previstas ni se puede arrastrar:
  hay que pausar. Si dos cuerpos chocan, se para sola.
  Los cambios de estado (avanzar un fotograma, reproducir/pausar, reiniciar, dar
  velocidad) pasan por un reducer (`simulationState.ts`), que es una función pura y no
  toca React; el bucle de animación solo pide "avanzar" en cada fotograma.
  Limitaciones: la velocidad de la animación depende de los fotogramas por segundo (0,03
  de tiempo por fotograma, unos 3,5 s por vuelta a 60 fps), y arrastrar el Sol
  con la misma escala que la Tierra es muy brusco (una velocidad de 1 lo aleja de la
  Tierra enseguida): con arrastres pequeños se controla mejor. Arrastrar no se puede
  hacer con teclado. Pendiente: alternativa accesible (campos numéricos o flechas) y
  sliders de masa.
- Paso 5 (velocidad): en lugar de los cuerpos aparece la simulación de la órbita
  (`OrbitScene`, la misma de `/simulacion`, pero sin reproducir y solo con la Tierra arrastrable). El texto es "La
  Tierra no cae hacia el Sol porque se está moviendo de lado con una velocidad lateral
  (verde), siguiendo una órbita (turquesa)". El tooltip de la velocidad explica por qué
  la Tierra la tiene (el Sistema Solar nació de una nube que giraba) y el de la órbita
  qué es, cuándo cambia y cómo probarlo arrastrando la Tierra. La línea discontinua de la
  órbita es también turquesa, y la goma del arrastre verde. No hay comprobación del
  resultado ni texto que diga cómo acaba la órbita: la línea ya enseña la forma (círculo,
  elipse, caída o escape). Los cuerpos se dibujan más grandes que en la primera versión
  porque se veían muy pequeños, y el dibujo se ajusta más a la órbita. En móvil el
  dibujo mide 160px y el texto es más pequeño (para todos los pasos) para que el paso
  quepa en 375×667 sin scroll.
- Paso 6 (caos): la misma simulación con un tercer cuerpo (rojo, como la palabra
  "caótica"; con la décima parte de la masa del Sol). Como `predictTrajectories` avanza todo el sistema, no hizo falta
  cambiar la física. Al arrastrar la Tierra, un pequeño cambio de velocidad deforma por
  completo la órbita dibujada, mientras que con dos cuerpos siempre era una elipse. Con
  tres cuerpos los caminos pasan cerca de otro cuerpo con frecuencia y la predicción se
  corta al acercarse demasiado, así que el contorno a veces es solo un arco corto. La
  escena empieza de nuevo al pasar del 5 al 6 (velocidad incluida). La masa y la posición del
  tercer cuerpo se eligieron a ojo para que el efecto se note: no son reales.
- Paso 7 (final, `FinalStep`): tres botones con preguntas ("Explícame cómo funcionaría
  en 3D", "Cuéntame más sobre la historia de la ley de gravitación universal" y, como
  pregunta extra, "¿Dónde vemos tres cuerpos en la vida real?"), la pregunta grande "¿Crees
  que eres capaz de encontrar una solución al problema de los 3 cuerpos?" y el botón
  "Ir a la simulación", que lleva a `/simulacion`. La pantalla es distinta a las demás
  (sin cuerpos ni texto al lado), así que es un componente propio que el paso activa con
  `isFinalStep`. Aquí no hay botón "Siguiente" ni "Saltar introducción".
- Integración con un modelo de lenguaje: los tres botones de preguntas del paso final
  llaman a `/api/preguntar` (`src/app/api/preguntar/route.ts`), una ruta de Next.js que
  hace de intermediario con [Groq](https://groq.com) (gratuito, compatible con la API de
  OpenAI) usando axios. La clave (`GROQ_API_KEY`) solo vive en el servidor; el modelo por
  defecto es `llama-3.3-70b-versatile`, cambiable con `GROQ_MODEL` sin tocar código. La
  ruta solo acepta las tres preguntas fijas de `src/lib/questions.ts` (compartido entre
  el botón y la ruta): así la clave del servidor no sirve como un proxy abierto a
  cualquier pregunta. Es una única llamada sin conversación ni reintentos: se pulsa un
  botón, se ve "Pensando la respuesta…" y luego la respuesta o un error genérico. Sin
  `GROQ_API_KEY` configurada, la ruta devuelve un error claro en vez de fallar sin más.
  Para probarlo hace falta una clave gratuita de <https://console.groq.com/keys> en
  `.env.local` (ver `.env.example`).
- El elemento interactivo propio de los mínimos de la Parte A es la simulación de la
  órbita (arrastrar un cuerpo, reproducir/pausar/reiniciar, sliders de masa, posición y
  velocidad), presente desde el paso 5 y completa en `/simulacion`.
