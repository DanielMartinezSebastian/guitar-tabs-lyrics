export type Instrument = "guitar" | "ukulele" | "other";

export interface SongVersionSummary {
  id: string;
  instrument: Instrument;
  label: string;
  file: string;
}

export interface SongSummary {
  id: string;
  title: string;
  artist: string;
  versions: SongVersionSummary[];
}

export interface SongVersion {
  songId: string;
  id: string;
  instrument: Instrument;
  label: string;
  capo?: number;
  tuning?: string;
  content: string;
}

/**
 * frets: una entrada por cuerda, de la más grave/izquierda a la más
 * aguda/derecha en el diagrama (ej. guitarra: Mi-La-Re-Sol-Si-Mi).
 * "x" = cuerda no tocada, 0 = al aire, N = traste N.
 */
export interface ChordDiagram {
  baseFret?: number;
  frets: (number | "x")[];
}

export type ChordDictionary = Record<string, ChordDiagram>;
