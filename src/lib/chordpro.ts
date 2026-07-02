export interface ChordProToken {
  chord: string | null;
  text: string;
}

export interface ChordProLine {
  tokens: ChordProToken[];
}

/**
 * Parsea una línea con acordes inline tipo ChordPro ("[F]Hey Jude") en
 * segmentos {chord, text}, donde `chord` es el acorde que se toca justo al
 * empezar `text`. El primer segmento puede no tener acorde si hay texto
 * antes del primer marcador.
 */
function parseLine(line: string): ChordProToken[] {
  const chordPositions: { chord: string; index: number }[] = [];
  let plain = "";
  let i = 0;

  while (i < line.length) {
    if (line[i] === "[") {
      const end = line.indexOf("]", i);
      if (end !== -1) {
        chordPositions.push({ chord: line.slice(i + 1, end), index: plain.length });
        i = end + 1;
        continue;
      }
    }
    plain += line[i];
    i++;
  }

  if (chordPositions.length === 0) {
    return [{ chord: null, text: plain }];
  }

  const tokens: ChordProToken[] = [];
  if (chordPositions[0].index > 0) {
    tokens.push({ chord: null, text: plain.slice(0, chordPositions[0].index) });
  }
  chordPositions.forEach((position, idx) => {
    const nextIndex = chordPositions[idx + 1]?.index ?? plain.length;
    tokens.push({ chord: position.chord, text: plain.slice(position.index, nextIndex) });
  });

  return tokens;
}

/** Parsea el contenido completo de una versión (ver specs/01-data-model.md). */
export function parseChordPro(content: string): ChordProLine[] {
  return content.split("\n").map((line) => ({ tokens: parseLine(line) }));
}

/** Acordes únicos usados, en orden de primera aparición (para la leyenda). */
export function extractChords(content: string): string[] {
  const seen = new Set<string>();
  for (const line of parseChordPro(content)) {
    for (const token of line.tokens) {
      if (token.chord) seen.add(token.chord);
    }
  }
  return [...seen];
}
