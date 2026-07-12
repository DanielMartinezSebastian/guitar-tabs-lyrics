import type { Instrument } from "./types";

export interface TunerString {
  id: string;
  /** Nombre de nota en notación latina, ej. "Mi". */
  note: string;
  /** Posición física de la cuerda tal cual se toca (1ª, 2ª...). */
  position: number;
  frequency: number;
}

export interface InstrumentTuning {
  instrument: "guitar" | "ukulele";
  label: string;
  /** Orden físico real (no por altura): de la cuerda 1 a la última. */
  strings: TunerString[];
}

export const TUNER_INSTRUMENTS: Extract<Instrument, "guitar" | "ukulele">[] = [
  "guitar",
  "ukulele",
];

export const TUNINGS: Record<"guitar" | "ukulele", InstrumentTuning> = {
  guitar: {
    instrument: "guitar",
    label: "Guitarra",
    strings: [
      { id: "E4", note: "Mi", position: 1, frequency: 329.63 },
      { id: "B3", note: "Si", position: 2, frequency: 246.94 },
      { id: "G3", note: "Sol", position: 3, frequency: 196.0 },
      { id: "D3", note: "Re", position: 4, frequency: 146.83 },
      { id: "A2", note: "La", position: 5, frequency: 110.0 },
      { id: "E2", note: "Mi", position: 6, frequency: 82.41 },
    ],
  },
  ukulele: {
    // Reentrante (Sol agudo), afinación estándar de soprano/concierto.
    instrument: "ukulele",
    label: "Ukelele",
    strings: [
      { id: "A4", note: "La", position: 1, frequency: 440.0 },
      { id: "E4", note: "Mi", position: 2, frequency: 329.63 },
      { id: "C4", note: "Do", position: 3, frequency: 261.63 },
      { id: "G4", note: "Sol", position: 4, frequency: 392.0 },
    ],
  },
};

/** Diferencia en cents entre una frecuencia detectada y un objetivo (100 cents = 1 semitono). */
export function centsBetween(frequency: number, targetFrequency: number): number {
  return 1200 * Math.log2(frequency / targetFrequency);
}

/** Cuerda del set actual más cercana en cents a la frecuencia detectada. */
export function closestString(frequency: number, strings: TunerString[]): TunerString {
  return strings.reduce((closest, current) =>
    Math.abs(centsBetween(frequency, current.frequency)) <
    Math.abs(centsBetween(frequency, closest.frequency))
      ? current
      : closest
  );
}

const CHROMATIC_NOTES = [
  "Do",
  "Do#",
  "Re",
  "Re#",
  "Mi",
  "Fa",
  "Fa#",
  "Sol",
  "Sol#",
  "La",
  "La#",
  "Si",
];

/** Nombre de nota cromática (con octava) más cercano a una frecuencia, independiente del instrumento. */
export function nearestNoteName(frequency: number): string {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  const note = CHROMATIC_NOTES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}
