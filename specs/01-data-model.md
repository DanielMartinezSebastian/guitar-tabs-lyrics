# 01 · Modelo de datos (JSON)

Modelo **decidido** (bloque 2 de `03-open-questions.md`). Detalles menores
pueden afinarse al implementar, pero esto ya no es un borrador con opciones
abiertas.

## Formato de letra+acordes: ChordPro inline

Los acordes se anotan inline en el texto entre corchetes, justo antes de la
sílaba donde se tocan (formato tipo [ChordPro](https://www.chordpro.org/)).
El renderer parsea el texto y calcula la posición visual del acorde.

```
[F]Hey Jude, don't make it [C]bad
[F]Take a sad song and make it [C]better
```

- Los saltos de línea del propio texto ya delimitan versos/estrofas — **no
  se modelan secciones con nombre** (Verso 1, Estribillo...) en v1. Una línea
  en blanco separa bloques visualmente.
- El nombre del acorde usa notación anglosajona (`C`, `G`, `Am`, `G7`...).

## Organización de archivos

Cada **versión** de una canción es su propio archivo JSON (no un array de
versiones dentro de un único archivo de canción). El motivo: canciones que
solo existen en un instrumento, o con variantes numeradas del mismo
instrumento (ej. una segunda tab de guitarra más simple), sin forzar a
declarar versiones vacías o listas que crecen de forma desigual.

```
data/
  index.json                     # índice: qué canciones y versiones existen
  versions/
    hey-jude-guitar.json
    hey-jude-ukulele.json
    wonderwall-guitar.json
    wonderwall-guitar-v2.json     # variante alternativa, mismo instrumento
  chords/
    guitar.json                   # diccionario de diagramas de acorde
    ukulele.json
```

### `data/index.json`

Índice ligero para listar/buscar canciones sin cargar el contenido completo
de cada versión.

```json
[
  {
    "id": "hey-jude",
    "title": "Hey Jude",
    "artist": "The Beatles",
    "versions": [
      { "id": "guitar", "instrument": "guitar", "label": "Guitarra - estándar", "file": "hey-jude-guitar.json" },
      { "id": "ukulele", "instrument": "ukulele", "label": "Ukelele - estándar", "file": "hey-jude-ukulele.json" }
    ]
  }
]
```

### `data/versions/{songId}-{versionId}.json`

```json
{
  "songId": "hey-jude",
  "id": "guitar",
  "instrument": "guitar",
  "label": "Guitarra - estándar",
  "capo": 0,
  "tuning": "standard",
  "content": "[F]Hey Jude, don't make it [C]bad\n[F]Take a sad song and make it [C]better"
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `songId` | string | referencia a la canción en `index.json` |
| `id` | string | slug de la versión, único dentro de la canción (`guitar`, `guitar-v2`, `ukulele`...) |
| `instrument` | enum | `guitar` \| `ukulele` \| `other` |
| `label` | string | nombre visible de la versión (ej. "Guitarra - alternativa simplificada") |
| `capo` | number? | opcional |
| `tuning` | string? | opcional, por defecto `"standard"`. Cubre afinaciones alternativas (DADGAD, Drop D...) sin necesitar un instrumento `"other"` |
| `content` | string | letra + acordes en formato ChordPro |

**Variantes del mismo instrumento** (ej. una tab alternativa de guitarra) se
modelan como una versión más con `id` distinto (`guitar-v2`) y su propio
archivo (`{songId}-guitar-v2.json`), listada junto a las demás en
`index.json`. `instrument: "other"` queda como comodín genérico para casos
que no encajen en `guitar`/`ukulele`, con `label` describiéndolo.

## Diccionario global de diagramas de acorde

Los diagramas de acorde para la leyenda (ver `02-features.md`) viven en un
diccionario global por instrumento, no embebidos en cada versión — un mismo
acorde (ej. "Am" en guitarra estándar) es siempre el mismo dibujo.

```json
// data/chords/guitar.json
{
  "Am": { "baseFret": 1, "frets": [0, 0, 2, 2, 1, 0] },
  "C":  { "baseFret": 1, "frets": [-1, 3, 2, 0, 1, 0] }
}
```

La lista de acordes únicos que aparecen en una versión se **extrae del
`content`** al vuelo (parseando los `[Acorde]`), en lugar de duplicarla como
campo separado.

## Capa de acceso a datos (agnóstica al almacenamiento)

La app no debe leer estos archivos JSON directamente desde los componentes
de UI. Se define una capa/servicio (ej. `SongRepository`) con una interfaz
mínima:

- `listSongs(): SongSummary[]` — a partir de `index.json`.
- `getVersion(songId, versionId): SongVersion` — carga el archivo de la
  versión concreta.
- `getChordDiagram(instrument, chordName): ChordDiagram | undefined`

La implementación inicial lee los JSON estáticos, pero el resto de la app
solo depende de esta interfaz. Así, si el catálogo crece y hace falta un
backend/DB real más adelante, se sustituye la implementación sin tocar UI.

## Pendiente (no bloquea el arranque)

- Nombre exacto y forma final de `ChordDiagram` (frets/fingers/dedos) — se
  puede resolver al implementar el componente de diagrama.
