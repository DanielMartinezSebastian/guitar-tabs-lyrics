# Tabs & Lyrics

Web app para consultar **tablaturas de canciones famosas con anotaciones sobre
la letra**. Pensada para quien toca y canta a la vez: buscas la canción, ves
los acordes colocados sobre el texto, y cambias entre versiones (guitarra,
ukelele, otras variantes) de la misma canción sin perder el sitio.

## Objetivo

- Buscador rápido de canciones.
- Vista de tablatura con acordes anotados directamente sobre la letra.
- Pivote entre versiones de instrumento (guitarra ⇄ ukelele ⇄ otras) cuando
  existan varias para la misma canción.
- Base de datos inicial en **JSON**, sin backend de datos todavía.

## No-objetivos (explícitos)

- **No es una red social.** Sin perfiles públicos, comentarios, "me gusta" ni
  seguidores.
- **No es un conversor/transportador de acordes** como producto central (puede
  evaluarse más adelante, no es el foco).
- **No prioriza compartir en redes.** El foco es la experiencia de tocar y
  cantar, no la viralidad ni el crecimiento social.

## Estado del proyecto

🚧 En fase de **especificación** (spec-driven development). Antes de escribir
código de producto, revisa y completa los documentos en [`specs/`](specs/):

1. [`specs/00-vision.md`](specs/00-vision.md) — problema, usuario, objetivos.
2. [`specs/01-data-model.md`](specs/01-data-model.md) — forma del JSON de
   canciones/versiones.
3. [`specs/02-features.md`](specs/02-features.md) — requisitos funcionales.
4. [`specs/03-open-questions.md`](specs/03-open-questions.md) — preguntas
   pendientes, agrupadas por fase, que hay que resolver antes de implementar.

## Stack (a confirmar)

Aún no decidido — se fija tras resolver `specs/03-open-questions.md` (bloque
"Stack técnico"). Candidato por defecto si no hay preferencia: **Vite + React
+ TypeScript**, datos como JSON estático servido con la propia app (sin
backend), desplegable en GitHub Pages/Vercel/Netlify.

## Estructura propuesta

```
specs/            Documentos de especificación (fuente de verdad del producto)
data/             JSON de canciones/versiones (o public/data si hay bundler)
src/              Código de la app (una vez arrancado el desarrollo)
```

## Cómo contribuir / desarrollar

Pendiente de definir hasta cerrar el stack técnico en `specs/`.
