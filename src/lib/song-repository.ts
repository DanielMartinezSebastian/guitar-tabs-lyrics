import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type {
  ChordDictionary,
  Instrument,
  SongSummary,
  SongVersion,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(relativePath: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, relativePath), "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Capa de acceso a datos agnóstica al almacenamiento (specs/01-data-model.md).
 * La implementación de hoy lee JSON estático; el resto de la app solo
 * depende de esta interfaz, así que cambiar a un backend real más adelante
 * no debería tocar componentes ni páginas.
 */
export const songRepository = {
  async listSongs(): Promise<SongSummary[]> {
    return readJson<SongSummary[]>("index.json");
  },

  async getSong(songId: string): Promise<SongSummary | undefined> {
    const songs = await this.listSongs();
    return songs.find((song) => song.id === songId);
  },

  async getVersion(
    songId: string,
    versionId: string
  ): Promise<SongVersion | undefined> {
    const song = await this.getSong(songId);
    const summary = song?.versions.find((v) => v.id === versionId);
    if (!summary) return undefined;
    return readJson<SongVersion>(path.join("versions", summary.file));
  },

  async getChordDictionary(instrument: Instrument): Promise<ChordDictionary> {
    try {
      return await readJson<ChordDictionary>(
        path.join("chords", `${instrument}.json`)
      );
    } catch {
      return {};
    }
  },
};
