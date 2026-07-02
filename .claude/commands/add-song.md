---
description: Añade una canción (letra+acordes en ChordPro, pegada por el usuario) al catálogo de data/
---

Vas a dar de alta una nueva canción o versión en el catálogo de este proyecto
(ver `specs/01-data-model.md`).

## Regla innegociable

**No generes ni completes letras de canciones desde tu propio conocimiento,
aunque el usuario solo pida "añade Hey Jude" o similar.** Las letras son
contenido con copyright; solo se pueden incorporar si el usuario las pega él
mismo (las habrá consultado donde sea su fuente habitual). Si el usuario pide
una canción sin pegar el contenido, pídele explícitamente que pegue el texto
en formato ChordPro (acordes entre corchetes justo antes de la sílaba, ej.
`[F]Hey Jude, don't make it [C]bad`). No continúes sin ese texto.

Lo que sí puedes generar tú sin problema: slugs, estructura de archivos,
diagramas de acorde (las digitaciones de un acorde son información funcional,
no expresión protegida) y cualquier otro dato mecánico de este flujo.

## Datos que necesitas del usuario

Si falta alguno, pregúntalo antes de continuar:

1. Título y artista.
2. Instrumento de esta versión (`guitar` | `ukulele` | `other`).
3. Capo y/o afinación, si aplica (opcional).
4. Etiqueta de la versión (`label`), ej. "Guitarra - estándar" — si hay dudas,
   usa un valor por defecto razonable según el instrumento.
5. El contenido completo en ChordPro, pegado literalmente por el usuario.

## Pasos

1. **Localiza o crea la canción** en `data/index.json`:
   - Si ya existe una canción con el mismo `title`+`artist` (comparación
     insensible a mayúsculas/acentos), añade la nueva versión a su array
     `versions`.
   - Si no existe, crea una nueva entrada. `id` = slug kebab-case del título
     (sin acentos, minúsculas, espacios a guiones).

2. **Determina el `versionId`**: normalmente el nombre del instrumento
   (`guitar`, `ukulele`). Si ya existe una versión con ese instrumento para
   la misma canción, usa un sufijo (`guitar-v2`, etc.) y pide al usuario una
   `label` que la distinga (ej. "Guitarra - versión simplificada").

3. **Crea `data/versions/{songId}-{versionId}.json`** siguiendo el esquema de
   `src/lib/types.ts` (`SongVersion`): `songId`, `id`, `instrument`, `label`,
   `capo?`, `tuning?`, `content` (el ChordPro tal cual lo pegó el usuario, sin
   modificar la letra).

4. **Extrae los acordes únicos** del `content` (misma lógica que
   `src/lib/chordpro.ts` → `extractChords`: todo lo que va entre `[` `]`, en
   orden de aparición).

5. **Completa el diccionario de acordes** en `data/chords/{instrument}.json`:
   para cada acorde extraído que no exista ya en ese diccionario, añade su
   digitación estándar más habitual (`baseFret` + `frets`, formato descrito
   en `01-data-model.md` — un valor por cuerda, de la más grave/izquierda a
   la más aguda/derecha; `"x"` = no se toca, `0` = al aire). Si el acorde
   admite varias digitaciones comunes, usa la más básica/abierta salvo que el
   usuario pida otra.

6. **Actualiza `data/index.json`** con la entrada/versión nueva.

7. **Valida**: comprueba que los JSON son válidos y que
   `npx tsc --noEmit` sigue sin errores.

8. **Resume** al usuario qué se ha creado (archivos, acordes añadidos al
   diccionario si los hubo) y la ruta para verlo (`/song/{songId}/{versionId}`
   con el dev server arrancado).
