# 00 · Visión de producto

## Problema

Al tocar y cantar una canción a la vez, el músico necesita ver la letra con
los acordes colocados exactamente donde se tocan, y a menudo la misma canción
existe en más de una "versión" (guitarra estándar, ukelele, afinación
alternativa, versión simplificada...). Cambiar de una fuente a otra para
comparar versiones, o depender de sitios llenos de anuncios y funciones
sociales irrelevantes, distrae del objetivo real: tocar y cantar bien.

## Usuario objetivo

- **Guitarrista/ukulelista que también canta**, en formato solista o de
  cancionero personal (no una banda con arreglos complejos multi-instrumento).
- Nivel intermedio: sabe leer acordes con nombre (Am, C, G7...) sobre la
  letra; no necesita tablatura numérica de línea (TAB clásico de 6 líneas)
  para toda la canción. Sí valora tener a mano el diagrama de cada acorde
  usado en la canción como referencia rápida y opcional.
- **Uso personal por ahora**: la app no está pensada para otros usuarios desde
  el día uno (no hace falta onboarding ni gestión de cuentas). La interfaz sí
  se prepara en español e inglés desde v1.

## Objetivos (in scope)

- Encontrar una canción rápido (buscador por título/artista).
- Leer la letra con acordes anotados de forma clara y legible en pantalla
  (móvil/tablet apoyada mientras se toca), con el nombre del acorde colocado
  exactamente donde cambia.
- Consultar el diagrama de cualquier acorde usado en la canción sin perder el
  sitio en la letra (leyenda de acordes, ver `02-features.md`).
- Cambiar entre versiones disponibles de la misma canción (instrumento u
  otra variante) sin perder el punto de lectura.

## No-objetivos (out of scope, explícito)

- Funciones sociales: perfiles, comentarios, compartir, seguir usuarios.
- Edición colaborativa / comunidad de aportación de tabs (al menos en v1).
- Reproducción de audio/backing tracks (a menos que se decida lo contrario).
- Transposición automática de tono como feature central (puede añadirse
  después si aporta valor real al caso de uso, no es el motivo de ser de la
  app).

## Criterio de éxito de la v1

- Puedo buscar una canción conocida, ver su letra+acordes, y si existe en
  guitarra y ukelele, cambiar entre ambas en un toque, sin perder el scroll.
