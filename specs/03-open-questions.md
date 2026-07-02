# 03 · Preguntas abiertas (plan de spec-driven development)

Este documento es la hoja de ruta: vamos resolviendo un bloque cada vez, en
orden, y el resultado de cada bloque se vuelca en el spec correspondiente
(`00-vision.md`, `01-data-model.md`, `02-features.md`) antes de escribir
código. No se empieza a implementar hasta cerrar al menos los bloques 1-4.

## Bloque 1 — Alcance y usuario (afina `00-vision.md`)

1. ¿El usuario necesita TAB numérico de 6 líneas (diagrama de traste) o solo
   acordes con nombre (Am, C, G7...) sobre la letra?
2. ¿Se necesitan diagramas de acordes (dibujo del cifrado en el mástil) o
   basta con el nombre del acorde como texto?
3. ¿Cuántas canciones aproximadamente irán en el catálogo inicial (10, 100,
   1000+)? Esto condiciona si un único JSON basta o hace falta indexar.
4. ¿La app es solo para ti/uso personal, o se espera que otras personas la
   usen desde ya (afecta a idioma de UI, onboarding, etc.)?

## Bloque 2 — Modelo de datos (cierra `01-data-model.md`)

5. ¿Opción A (líneas estructuradas) u Opción B (texto tipo ChordPro) para el
   JSON? (ver el documento de datos para ejemplos concretos)
6. ¿Un archivo JSON por canción, o un único archivo con todas? (afecta a cómo
   escalará el catálogo y el tiempo de carga)
7. ¿Hace falta modelar secciones con nombre (Verso 1, Estribillo, Puente) o
   con el salto de línea/párrafo basta?
8. ¿"Otras versiones" (no guitarra/ukelele) qué casos reales cubren? (ej.
   afinación alternativa, versión fingerstyle, versión simplificada para
   principiantes...) — ayuda a decidir si `instrument: "other"` necesita
   subtipos.

## Bloque 3 — Funcionalidad (cierra `02-features.md`)

9. ¿El tamaño de letra debe ser ajustable por el usuario (para leer desde
   lejos mientras se toca)?
10. ¿Hace falta un modo "autoscroll" (desplazamiento automático mientras se
    toca), aunque no haya audio? Es una feature muy típica de estas apps y
    encaja con el foco guitarrista/cantante.
11. ¿Buscador solo por título/artista, o también por letra (buscar una
    canción por una frase que recuerdas)?
12. ¿Hace falta un listado/catálogo navegable (por artista, alfabético) además
    del buscador, o el buscador es la única vía de entrada?

## Bloque 4 — Stack técnico (cierra sección "Stack" del `README.md`)

13. ¿Preferencia de framework (React/Vue/Svelte/vanilla) o delego en el
    candidato por defecto (Vite + React + TypeScript)?
14. ¿Dónde se desplegará? (GitHub Pages, Vercel, Netlify, otro) — condiciona
    si puede ser 100% estático o necesita un pequeño backend.
15. ¿Se necesita que funcione offline (PWA) desde v1, o es opcional/futuro?

## Bloque 5 — No-funcionales y futuro (informativo, no bloquea v1)

16. ¿Móvil first o escritorio first? (afecta layout y tamaños táctiles)
17. ¿Habrá alguna vez necesidad de aportación de contenido por terceros
    (aunque hoy sea "editar el JSON a mano")? Si es que sí, en qué momento
    conviene prever una capa de import/validación de esos JSON.
18. ¿Idioma(s) de la interfaz? (español, inglés, ambos)

---

**Cómo usarlo:** contesta un bloque, actualizamos el spec correspondiente,
pasamos al siguiente. Cuando los bloques 1-4 estén cerrados, se puede
arrancar el scaffold del proyecto con el stack decidido.
