# 03 · Preguntas abiertas (plan de spec-driven development)

Este documento es la hoja de ruta: vamos resolviendo un bloque cada vez, en
orden, y el resultado de cada bloque se vuelca en el spec correspondiente
(`00-vision.md`, `01-data-model.md`, `02-features.md`) antes de escribir
código. No se empieza a implementar hasta cerrar al menos los bloques 1-4.

## Bloque 1 — Alcance y usuario (afina `00-vision.md`) ✅ Resuelto

1. ¿El usuario necesita TAB numérico de 6 líneas (diagrama de traste) o solo
   acordes con nombre (Am, C, G7...) sobre la letra?
   → **Solo el nombre del acorde (notación anglosajona) anotado sobre la
   letra**, en el punto exacto donde cambia. No se necesita TAB de 6 líneas
   para toda la canción.
2. ¿Se necesitan diagramas de acordes (dibujo del cifrado en el mástil) o
   basta con el nombre del acorde como texto?
   → **Sí, pero como leyenda**, no incrustados en cada línea de letra: la
   canción muestra siempre (ocultable) una leyenda con el diagrama de cada
   acorde único usado. Pulsar un acorde anotado en la letra resalta ese
   acorde en la leyenda. Ver detalle en `02-features.md` ("Leyenda de
   acordes") y `01-data-model.md` ("Diagramas de acorde").
3. ¿Cuántas canciones aproximadamente irán en el catálogo inicial (10, 100,
   1000+)? Esto condiciona si un único JSON basta o hace falta indexar.
   → **~5 canciones** para empezar a probar features y UI. Un único JSON es
   más que suficiente por ahora; no hace falta indexación.
4. ¿La app es solo para ti/uso personal, o se espera que otras personas la
   usen desde ya (afecta a idioma de UI, onboarding, etc.)?
   → **Uso personal por ahora.**

## Bloque 2 — Modelo de datos (cierra `01-data-model.md`) ✅ Resuelto

5. ¿Opción A (líneas estructuradas) u Opción B (texto tipo ChordPro) para el
   JSON? → **ChordPro inline** (Opción B).
6. ¿Un archivo JSON por canción, o un único archivo con todas? → **Un
   archivo por versión** (`{songId}-{versionId}.json`), con un `index.json`
   ligero para listar/buscar. Además, el acceso a los datos se abstrae en una
   capa de servicio agnóstica al almacenamiento (`SongRepository`), para
   poder sustituir los JSON estáticos por un backend/DB real más adelante sin
   tocar la UI.
7. ¿Secciones con nombre o basta el salto de línea/párrafo? → **Solo saltos
   de línea/párrafo** en v1, sin nombres de sección.
8. ¿"Otras versiones" qué casos reales cubren? → Principalmente **variantes
   del mismo instrumento** (ej. una segunda tab de guitarra más simple:
   `guitar-v2`) y afinaciones alternativas (cubiertas por el campo `tuning`,
   sin necesitar subtipos de `instrument`).
9. ¿Diccionario global de diagramas de acorde o embebido por versión? →
   **Diccionario global** por instrumento (`data/chords/guitar.json`, etc.).

## Bloque 3 — Funcionalidad (cierra `02-features.md`) ✅ Resuelto

10. ¿Tamaño de letra ajustable? → **Sí.**
11. ¿Modo "autoscroll" sin audio? → **Sí**, con velocidad ajustable.
12. ¿Buscador también por letra? → **No en v1**, solo título/artista.
13. ¿Listado/catálogo navegable además del buscador? → **Sí**, listado
    simple (ej. alfabético) como pantalla de inicio.

## Bloque 4 — Stack técnico (cierra sección "Stack" del `README.md`) ✅ Resuelto

14. ¿Framework? → **Next.js + TypeScript** (mejor escalabilidad y despliegue
    rápido en Vercel; sustituye al candidato por defecto Vite+React).
15. ¿Dónde se desplegará? → **Vercel.**
16. ¿PWA/offline desde v1? → **Sí, desde v1.**

## Bloque 5 — No-funcionales y futuro ✅ Resuelto

17. ¿Móvil first o escritorio first? → **Móvil first.**
18. ¿Aportación de contenido por terceros? → **No previsto.** Se mantiene
    edición manual de JSON; si surge la necesidad, se diseña una capa de
    import/validación en ese momento.
19. ¿Idioma(s) de la interfaz? → **Español e inglés.**

---

**Estado:** los 5 bloques están resueltos. Los specs (`00-vision.md`,
`01-data-model.md`, `02-features.md`, `README.md`) ya reflejan estas
decisiones. Siguiente paso: arrancar el scaffold del proyecto (Next.js +
TypeScript) según lo decidido en el bloque 4.
