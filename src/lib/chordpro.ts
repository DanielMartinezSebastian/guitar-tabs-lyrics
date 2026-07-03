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

export interface ChordWordUnit {
  chord: string | null;
  text: string;
  isSpace: boolean;
}

/**
 * Divide los tokens {chord, text} de una línea en unidades a nivel de
 * palabra, para poder ofrecer edición interactiva palabra por palabra. Solo
 * el primer fragmento no-espacio de cada token conserva el acorde del token
 * (que es donde ChordPro lo sitúa); el resto de palabras del mismo token no
 * llevan acorde.
 */
export function tokensToWords(tokens: ChordProToken[]): ChordWordUnit[] {
  const words: ChordWordUnit[] = [];
  for (const token of tokens) {
    const parts = token.text.split(/(\s+)/).filter((part) => part !== "");
    let pendingChord = token.chord;
    for (const part of parts) {
      const isSpace = /^\s+$/.test(part);
      words.push({ chord: isSpace ? null : pendingChord, text: part, isSpace });
      if (!isSpace) pendingChord = null;
    }
    if (parts.length === 0 && token.chord) {
      words.push({ chord: token.chord, text: "", isSpace: false });
    }
  }
  return words;
}

function wordsToLine(words: ChordWordUnit[]): string {
  return words.map((word) => (word.chord ? `[${word.chord}]${word.text}` : word.text)).join("");
}

/**
 * Devuelve el contenido ChordPro completo tras asignar (o quitar, pasando
 * `chord: null`) un acorde a la palabra `wordIndex` de la línea `lineIndex`.
 * No toca el resto del contenido, así que sigue siendo el mismo formato que
 * ya persistimos en `data/versions/*.json`.
 */
export function setWordChord(
  content: string,
  lineIndex: number,
  wordIndex: number,
  chord: string | null
): string {
  const rawLines = content.split("\n");
  const targetLine = rawLines[lineIndex];
  if (targetLine === undefined) return content;

  const [parsedLine] = parseChordPro(targetLine);
  const words = tokensToWords(parsedLine.tokens);
  if (!words[wordIndex]) return content;

  words[wordIndex] = { ...words[wordIndex], chord: chord?.trim() || null };
  rawLines[lineIndex] = wordsToLine(words);
  return rawLines.join("\n");
}
