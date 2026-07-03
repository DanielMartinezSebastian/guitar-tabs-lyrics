# 02 · Requisitos funcionales (v1)

## Catálogo y buscador

- Listado navegable de todas las canciones (ej. orden alfabético) como
  pantalla de inicio, además del buscador.
- Búsqueda por título y/o artista (no por letra en v1), tolerante a
  mayúsculas/acentos.
- Resultados instantáneos mientras se escribe (sin botón "buscar").
- Si no hay resultados, mensaje claro (no pantalla vacía).

## Vista de canción (tab + letra)

- Letra completa con acordes anotados en la posición correcta sobre el texto,
  usando el nombre del acorde en notación anglosajona (C, G, Am, G7...).
- Tipografía monoespaciada o alineación que garantice que el acorde cae sobre
  la sílaba correcta en cualquier ancho de pantalla razonable.
- Legible sosteniendo el móvil/tablet mientras se toca (contraste, tamaño de
  fuente **ajustable** por el usuario).
- **Autoscroll**: control play/pause que desplaza el texto automáticamente a
  velocidad ajustable por el usuario, sin necesidad de audio ni
  sincronización con la canción real.

## Leyenda de acordes

- Cada versión muestra una leyenda con el diagrama (dibujo del cifrado en el
  mástil) de cada acorde único que aparece en ella.
- La leyenda está visible por defecto, pero se puede ocultar/mostrar (no debe
  ocupar espacio permanentemente si el usuario no la quiere).
- Al pulsar/tocar un acorde anotado sobre la letra, se resalta ese acorde en
  la leyenda (si está visible) para consultar su diagrama sin perder el sitio
  en el texto.

## Pivote entre versiones

- Si una canción tiene más de una versión (guitarra, ukelele, otra), se
  muestra un selector (tabs/segmented control) para cambiar entre ellas.
- Cambiar de versión **no** resetea el scroll/posición de lectura si ambas
  versiones tienen longitud comparable (best-effort).
- Si solo hay una versión, no se muestra selector (no añadir UI innecesaria).

## Explícitamente fuera de v1 (salvo que open-questions diga lo contrario)

- Transposición de tono.
- Reproducción de audio.
- Cuenta de usuario, favoritos persistentes entre dispositivos, compartir.
- Edición/aportación de canciones desde la UI (la DB JSON se edita "a mano"
  o vía proceso de contenido, no desde la app).
