# 02 · Requisitos funcionales (v1)

## Buscador de canciones

- Búsqueda por título y/o artista, tolerante a mayúsculas/acentos.
- Resultados instantáneos mientras se escribe (sin botón "buscar").
- Si no hay resultados, mensaje claro (no pantalla vacía).

## Vista de canción (tab + letra)

- Letra completa con acordes anotados en la posición correcta sobre el texto.
- Tipografía monoespaciada o alineación que garantice que el acorde cae sobre
  la sílaba correcta en cualquier ancho de pantalla razonable.
- Legible sosteniendo el móvil/tablet mientras se toca (contraste, tamaño de
  fuente ajustable — *ver open-questions*).

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
