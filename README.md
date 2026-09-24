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

TypeScript · Next.js (App Router) · Tailwind CSS v4 · npm.

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
  explicado, que se muestran arriba. Hoy hay cuatro pasos (cuerpo, masa, gravedad y
  distancia); en el último, "Siguiente" queda desactivado.
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
  que el trazo y que se engruesa al señalarla. El azul de la distancia es algo más intenso que el
  de la palabra "masa" para que no se confundan.
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
- "Saltar introducción" sigue siendo solo visual.
- En móviles muy cortos (unos 568px de alto) la `m` de la fórmula queda casi pegada al
  contenido, sin llegar a solaparse.
- Todavía no hay simulación ni elemento interactivo propio, ni la integración con un
  modelo de lenguaje: son mínimos de la Parte A que faltan.
