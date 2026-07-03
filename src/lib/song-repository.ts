import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { extractChords } from "./chordpro";
import { slugify } from "./slug";
import type {
  AddVersionInput,
  AddVersionResult,
  ChordDictionary,
  Instrument,
  SongSummary,
  SongVersion,
  SongVersionSummary,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(relativePath: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, relativePath), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(relativePath: string, data: unknown): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, relativePath),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf-8"
  );
}

function normalizeForMatch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
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

  /**
   * Añade una canción nueva o una versión a una existente. El contenido lo
   * aporta quien llama (el formulario de la propia app) y se persiste tal
   * cual, sin pasar por ningún resumen/generación intermedia.
   */
  async addVersion(input: AddVersionInput): Promise<AddVersionResult> {
    const songs = await this.listSongs();

    const titleKey = normalizeForMatch(input.title);
    const artistKey = normalizeForMatch(input.artist);
    let song = songs.find(
      (s) =>
        normalizeForMatch(s.title) === titleKey &&
        normalizeForMatch(s.artist) === artistKey
    );

    let songId: string;
    if (song) {
      songId = song.id;
    } else {
      const baseSlug = slugify(input.title) || "cancion";
      songId = baseSlug;
      let suffix = 2;
      while (songs.some((s) => s.id === songId)) {
        songId = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      song = { id: songId, title: input.title, artist: input.artist, versions: [] };
      songs.push(song);
    }

    let versionId: string = input.instrument;
    let versionSuffix = 2;
    while (song.versions.some((v) => v.id === versionId)) {
      versionId = `${input.instrument}-v${versionSuffix}`;
      versionSuffix += 1;
    }

    const fileName = `${songId}-${versionId}.json`;
    const version: SongVersion = {
      songId,
      id: versionId,
      instrument: input.instrument,
      label: input.label,
      ...(input.capo !== undefined ? { capo: input.capo } : {}),
      ...(input.tuning ? { tuning: input.tuning } : {}),
      content: input.content,
    };
    await writeJson(path.join("versions", fileName), version);

    const summary: SongVersionSummary = {
      id: versionId,
      instrument: input.instrument,
      label: input.label,
      file: fileName,
    };
    song.versions.push(summary);
    await writeJson("index.json", songs);

    const dictionary = await this.getChordDictionary(input.instrument);
    const missingChords = extractChords(input.content).filter(
      (chord) => !(chord in dictionary)
    );

    return { songId, versionId, missingChords };
  },
};
