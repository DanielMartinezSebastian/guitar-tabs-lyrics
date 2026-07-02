# 04 · Estilo visual

Definido a partir de referencias de terceros, no desde cero. Sirve de guía
para implementar la UI de forma consistente.

## Referencias

- **Songsterr** — referencia principal: interfaz oscura, mínima, sin ruido,
  todo el foco en el contenido. Modelo para la vista de canción y el
  autoscroll.
- **Spotify / Apple Music (lyrics view)** — tipografía grande y legible a
  distancia, tema oscuro por defecto, coherente con "leer sujetando el móvil
  mientras tocas".
- **Ultimate Guitar** — referencia negativa: UI saturada de anuncios y ruido
  social, justo lo que esta app evita.

## Librerías a reutilizar (no reinventar)

- **Tailwind CSS + shadcn/ui** — sistema de componentes (botones, tabs,
  sheet/drawer, slider) sobre Radix, encaja de forma natural con Next.js.
- **svguitar** (o vexchords) — renderiza los diagramas de acorde de la
  leyenda como SVG a partir de datos simples (frets/fingers), en vez de
  dibujarlos a mano.
- **chordsheetjs** — parsea el formato ChordPro ya elegido en
  `01-data-model.md`.
- **Geist Sans / Geist Mono** (vía `next/font`, fuente open source de
  Vercel) — encaja de forma natural al desplegar ahí; fallback `Inter` /
  `ui-monospace`.

## Tema: oscuro (Songsterr/Spotify-like)

| Token | Valor aprox. (Tailwind) | Uso |
|---|---|---|
| `background` | `zinc-950` (#09090b) | fondo base de la app |
| `surface` | `zinc-900` (#18181b) | tarjetas, leyenda de acordes, barra inferior |
| `border` | `zinc-800` (#27272a) | separadores, bordes de tarjetas |
| `text-primary` | `zinc-50` (#fafafa) | letra de la canción, títulos |
| `text-secondary` | `zinc-400` (#a1a1aa) | artista, metadatos, placeholders |
| `accent` | `green-500` (#22c55e) | acorde resaltado, versión activa, botón de autoscroll |
| `accent-hover` | `green-400` (#4ade80) | estados hover/active del acento |
| `accent-muted` | `green-500` a 10-15% opacidad | fondo de resaltado suave (ej. wash tras un acorde) |

## Tipografía

- **UI (botones, barras, menús)**: Geist Sans.
- **Contenido (letra + acordes)**: Geist Mono — el monoespaciado es
  necesario para garantizar que el acorde cae sobre la sílaba correcta
  (requisito de `02-features.md`).
- Tamaño de letra de la canción: ajustable por el usuario (control +/-),
  rango orientativo 14–28px, por defecto ~18px en móvil.
- Nombre de acorde: mismo Geist Mono, peso bold, color `accent`, sobre la
  línea justo encima de la sílaba (convención ChordPro).

## Radios y espaciado

- Bordes redondeados moderados: `rounded-xl` (~12px) en tarjetas/chips de la
  leyenda, `rounded-md` (~8px) en botones e inputs. Ni completamente
  cuadrado ni excesivamente "bubbly".
- Espaciado generoso alrededor de la letra (line-height cómodo) para
  legibilidad a distancia.

## Movimiento

- Transiciones cortas y sutiles (150–200ms ease-out): cambio de versión,
  mostrar/ocultar leyenda, resaltado de acorde al pulsar.
- Nada de animaciones llamativas — el foco es la lectura, no el "wow".

## Layout (móvil first)

- Barra superior mínima: volver, título + artista, selector de versión
  (segmented control) si hay más de una.
- Leyenda de acordes: fila horizontal desplazable de chips (fondo
  `surface`, `rounded-xl`, borde `border`), cada una con nombre del acorde y
  su diagrama SVG (trazos claros sobre fondo oscuro). Ocultable con un
  toggle.
- Al pulsar un acorde en la letra: la leyenda hace scroll hasta ese chip y
  lo resalta con un anillo/glow en `accent` durante ~1s.
- Barra inferior flotante y fija: control de autoscroll (play/pause +
  velocidad) y acceso al ajuste de tamaño de letra, alcanzables con el
  pulgar mientras se sujeta el móvil.
