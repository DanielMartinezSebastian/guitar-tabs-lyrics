/**
 * Normaliza el markdown que cifraclub.com devuelve para sus tablaturas: los
 * acordes llegan en negrita ("**Am**") en una línea propia, alineados por
 * espaciado sobre la letra de la línea siguiente. La app solo entiende
 * acordes inline `[Acorde]texto` (ver src/lib/chordpro.ts), así que hay que
 * fusionar cada línea de acordes con la línea de letra que la sigue.
 */

const CHORD_LINE_RE = /^(\s*\*\*[A-G][^*]*\*\*\s*)+$/;
const CHORD_TOKEN_RE = /\*\*([A-G][^*]*)\*\*/g;

/** Nombres de acorde razonables: "Am", "E7", "C#m7", "G/B", "Bbmaj7"... */
const CHORD_NAME_RE = /^[A-G][#b]?(maj|min|dim|aug|sus|add)?\d{0,2}m?\d{0,2}(\/[A-G][#b]?)?$/i;

/**
 * Columna a partir de la cual consideramos que un acorde está en una
 * posición "avanzada" (intermedia dentro de la letra) y por tanto no se
 * puede fusionar de forma fiable al inicio de la línea de letra siguiente:
 * se deja en su propia línea `[Acorde]` en vez de intentar intercalarlo a
 * mitad de palabra.
 */
const MERGE_COLUMN_THRESHOLD = 3;

function isChordName(token: string): boolean {
  return CHORD_NAME_RE.test(token.trim());
}

interface ChordMatch {
  chord: string;
  column: number;
}

function extractChords(line: string): ChordMatch[] {
  const matches: ChordMatch[] = [];
  CHORD_TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CHORD_TOKEN_RE.exec(line)) !== null) {
    matches.push({ chord: match[1].trim(), column: match.index });
  }
  return matches;
}

/** Líneas de "decoración" (títulos de sección, directivas) que no son ni acorde ni letra. */
function isSectionLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed === "") return false;
  if (/^#{1,6}\s/.test(trimmed)) return true;
  if (/^\{[^}]*\}$/.test(trimmed)) return true;

  const boldOnly = trimmed.match(/^\*\*([^*]+)\*\*$/);
  if (boldOnly && !isChordName(boldOnly[1])) return true;

  const bracketOnly = trimmed.match(/^\[(.+)\]$/);
  if (bracketOnly && !isChordName(bracketOnly[1])) return true;

  return false;
}

function collapseBlankLines(lines: string[]): string[] {
  const result: string[] = [];
  let blankRun = 0;
  for (const line of lines) {
    if (line.trim() === "") {
      blankRun += 1;
      if (blankRun > 1) continue;
    } else {
      blankRun = 0;
    }
    result.push(line);
  }
  while (result.length > 0 && result[0].trim() === "") result.shift();
  while (result.length > 0 && result[result.length - 1].trim() === "") result.pop();
  return result;
}

export function normalizeCifraclub(text: string): string {
  const sourceLines = text
    .split(/\r?\n/)
    .filter((line) => !isSectionLine(line));

  const output: string[] = [];
  let i = 0;
  while (i < sourceLines.length) {
    const line = sourceLines[i];

    if (line.trim() !== "" && CHORD_LINE_RE.test(line)) {
      const chords = extractChords(line);
      const nextLine = sourceLines[i + 1];
      const hasLyric = nextLine !== undefined && nextLine.trim() !== "" && !CHORD_LINE_RE.test(nextLine);
      const lyricText = hasLyric ? nextLine.trim() : "";

      const [firstChord, ...restChords] = chords;
      let mergedIntoLyric = false;

      if (firstChord) {
        if (firstChord.column <= MERGE_COLUMN_THRESHOLD && hasLyric) {
          output.push(`[${firstChord.chord}]${lyricText}`);
          mergedIntoLyric = true;
        } else {
          output.push(`[${firstChord.chord}]`);
        }
      }

      for (const extra of restChords) {
        output.push(`[${extra.chord}]`);
      }

      if (hasLyric && !mergedIntoLyric) {
        output.push(lyricText);
      }

      i += hasLyric ? 2 : 1;
      continue;
    }

    output.push(line);
    i += 1;
  }

  return collapseBlankLines(output).join("\n");
}
