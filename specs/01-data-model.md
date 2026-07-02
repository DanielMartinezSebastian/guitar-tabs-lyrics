# 01 · Modelo de datos (JSON)

Borrador inicial — **sujeto a las decisiones de** `03-open-questions.md`
(bloque "Modelo de datos"). Dos opciones sobre la mesa; hay que elegir una:

## Opción A — formato estructurado por líneas

Explícito y fácil de renderizar tal cual, pero más verboso de escribir/mantener.

```json
{
  "id": "hey-jude",
  "title": "Hey Jude",
  "artist": "The Beatles",
  "versions": [
    {
      "id": "guitar-standard",
      "instrument": "guitar",
      "label": "Guitarra - estándar",
      "capo": 0,
      "tuning": "standard",
      "lines": [
        {
          "lyrics": "Hey Jude, don't make it bad",
          "chords": [
            { "chord": "F", "at": 0 },
            { "chord": "C", "at": 10 }
          ]
        }
      ]
    },
    {
      "id": "ukulele-standard",
      "instrument": "ukulele",
      "label": "Ukelele - estándar",
      "lines": [ ]
    }
  ]
}
```

- `chords[].at` = índice de carácter en `lyrics` donde va el acorde.
- `instrument`: `"guitar" | "ukulele" | "other"` (si `"other"`, `label`
  describe qué es: ej. "Versión simplificada", "Afinación DADGAD"...).

## Opción B — bloque tipo ChordPro (texto con acordes inline)

Más compacto y fácil de escribir a mano / importar, el renderer parsea el
texto.

```json
{
  "id": "hey-jude",
  "title": "Hey Jude",
  "artist": "The Beatles",
  "versions": [
    {
      "id": "guitar-standard",
      "instrument": "guitar",
      "label": "Guitarra - estándar",
      "capo": 0,
      "content": "[F]Hey Jude, don't make it [C]bad\n[F]Take a sad song and make it [C]better"
    }
  ]
}
```

## Campos comunes propuestos (ambas opciones)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | slug único de la canción |
| `title` | string | |
| `artist` | string | |
| `versions[].id` | string | slug único dentro de la canción |
| `versions[].instrument` | enum | `guitar` \| `ukulele` \| `other` |
| `versions[].label` | string | nombre visible de la versión |
| `versions[].capo` | number? | opcional |
| `versions[].tuning` | string? | opcional, por defecto "standard" |

## Pendiente de decidir (ver open-questions)

- ¿Opción A o B?
- ¿Un archivo JSON por canción o un único índice + archivos por canción?
- ¿Cómo se estructuran secciones de canción (verso/estribillo/puente)?
