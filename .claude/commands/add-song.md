---
description: Añade una canción de dominio público al catálogo de data/, o prepara el hueco para que el usuario añada una con copyright él mismo
---

Vas a dar de alta una nueva canción o versión en el catálogo de este proyecto
(ver `specs/01-data-model.md`).

## Regla innegociable (no depende de quién escriba el texto)

**Nunca escribas la letra completa (ni un fragmento largo) de una canción con
copyright en ningún archivo, ni la repitas en el chat** — da igual que la
generes tú de memoria o que el usuario la pegue en el propio mensaje. Guardar
o reproducir esa letra sigue siendo reproducir la obra protegida, aunque el
uso sea personal y aunque el texto de origen lo haya aportado el usuario. No
hay atajo: no la persistas.

Si el usuario pega la letra completa de una canción con copyright y pide que
la añadas:

1. **No crees el archivo de versión con ese contenido.** Explícale este
   límite con claridad (sin citar ni repetir lo que pegó).
2. Sí puedes: identificar los acordes únicos que mencionó y añadir sus
   digitaciones al diccionario (`data/chords/{instrument}.json`) — son datos
   funcionales, no protegidos.
3. Sí puedes: darle la ruta exacta del archivo que tendría que crear
   (`data/versions/{songId}-{versionId}.json`) y el esquema de campos
   (`songId`, `id`, `instrument`, `label`, `capo?`, `tuning?`, `content`),
   para que él mismo lo complete y lo commitee directamente (por ejemplo
   clonando el repo en su propia máquina), sin que el contenido pase por tu
   salida.
4. Sí puedes: si te ofrece solo una cita corta (1-3 líneas, a modo de
   ejemplo/prueba de formato, como se hizo con Hey Jude/Wonderwall en el
   scaffold inicial), esa sí se puede persistir — es una cita breve, no una
   reproducción de la obra.

## Cuándo SÍ puedes completar una canción entera tú mismo

Solo si es de **dominio público** (tradicionales/folk sin autor con derechos
vigentes, ej. "Amazing Grace", villancicos tradicionales, etc.) y estás
seguro de que el texto que vas a escribir es fiel a la versión tradicional,
no una letra de autor con copyright vigente. En ese caso sí puedes generar tú
la letra completa.

## Datos que necesitas del usuario (para el caso "sí se puede añadir")

1. Título y artista (o "Tradicional" si es de dominio público).
2. Instrumento de esta versión (`guitar` | `ukulele` | `other`).
3. Capo y/o afinación, si aplica (opcional).
4. Etiqueta de la versión (`label`) — si hay dudas, usa un valor por defecto
   razonable según el instrumento.
5. El contenido en ChordPro (acordes entre corchetes justo antes de la
   sílaba, ej. `[F]Hey Jude, don't make it [C]bad`).

## Pasos (solo cuando el contenido es seguro de persistir: dominio público o cita corta)

1. **Localiza o crea la canción** en `data/index.json`:
   - Si ya existe una canción con el mismo `title`+`artist` (comparación
     insensible a mayúsculas/acentos), añade la nueva versión a su array
     `versions`.
   - Si no existe, crea una nueva entrada. `id` = slug kebab-case del título
     (sin acentos, minúsculas, espacios a guiones).

2. **Determina el `versionId`**: normalmente el nombre del instrumento
   (`guitar`, `ukulele`). Si ya existe una versión con ese instrumento para
   la misma canción, usa un sufijo (`guitar-v2`, etc.) y pide al usuario una
   `label` que la distinga.

3. **Crea `data/versions/{songId}-{versionId}.json`** siguiendo el esquema de
   `src/lib/types.ts` (`SongVersion`).

4. **Extrae los acordes únicos** del `content` (misma lógica que
   `src/lib/chordpro.ts` → `extractChords`).

5. **Completa el diccionario de acordes** en `data/chords/{instrument}.json`
   para cualquier acorde que falte (`baseFret` + `frets`, ver
   `01-data-model.md`), incluso si al final no persistes la letra completa —
   esta parte siempre es segura de hacer.

6. **Actualiza `data/index.json`** con la entrada/versión nueva.

7. **Valida**: JSON bien formado y `npx tsc --noEmit` sin errores.

8. **Resume** al usuario qué se ha creado y la ruta para verlo
   (`/song/{songId}/{versionId}` con el dev server arrancado).
