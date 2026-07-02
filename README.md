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
5. [`specs/04-visual-style.md`](specs/04-visual-style.md) — estilo visual
   (referencias, tema, tipografía, layout).

## Stack

- **Next.js + TypeScript**, desplegado en **Vercel**.
- Datos como JSON estático (ver `specs/01-data-model.md`), leídos a través de
  una capa de acceso a datos agnóstica al almacenamiento (para poder
  sustituirlos por un backend real más adelante sin tocar la UI).
- **Tailwind CSS + shadcn/ui** para componentes, **svguitar** para diagramas
  de acorde y **chordsheetjs** para parsear ChordPro (ver
  `specs/04-visual-style.md`).
- **PWA / soporte offline desde v1.**
- Diseño **móvil first**, tema **oscuro** (uso principal: móvil/tablet
  apoyada mientras se toca y canta).
- Idioma de interfaz: **español e inglés**.

## Estructura propuesta

```
specs/            Documentos de especificación (fuente de verdad del producto)
data/             JSON de canciones/versiones/diagramas de acorde (ver specs/01-data-model.md)
src/ (o app/)     Código de la app Next.js
```

## Cómo contribuir / desarrollar

Pendiente de arrancar el scaffold del proyecto (`create-next-app`) ahora que
el stack y los specs de las fases 1-4 están cerrados.
