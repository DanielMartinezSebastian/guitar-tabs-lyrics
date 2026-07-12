"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AudioLines, Plus, Search, Zap } from "lucide-react";
import type { SongSummary } from "@/lib/types";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

interface CatalogProps {
  songs: SongSummary[];
  canAddSongs?: boolean;
}

export function Catalog({ songs, canAddSongs = false }: CatalogProps) {
  const [query, setQuery] = useState("");

  const sortedSongs = useMemo(
    () => [...songs].sort((a, b) => a.title.localeCompare(b.title, "es")),
    [songs]
  );

  const filteredSongs = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return sortedSongs;
    return sortedSongs.filter(
      (song) =>
        normalize(song.title).includes(normalizedQuery) ||
        normalize(song.artist).includes(normalizedQuery)
    );
  }, [sortedSongs, query]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título o artista..."
            className="w-full rounded-md border border-border bg-surface py-2.5 pr-3 pl-10 text-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-accent focus:outline-none"
          />
        </div>
        <Link
          href="/preview"
          aria-label="Vista previa rápida"
          className="flex items-center justify-center rounded-md border border-border bg-surface px-3 text-text-secondary transition-colors hover:text-accent"
        >
          <Zap className="h-5 w-5" />
        </Link>
        {canAddSongs && (
          <Link
            href="/admin/songs/new"
            aria-label="Añadir canción"
            className="flex items-center justify-center rounded-md border border-border bg-surface px-3 text-text-secondary transition-colors hover:text-accent"
          >
            <Plus className="h-5 w-5" />
          </Link>
        )}
      </div>

      {filteredSongs.length === 0 ? (
        <p className="text-text-secondary">No se ha encontrado ninguna canción.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border">
          {filteredSongs.map((song) => {
            const firstVersion = song.versions[0];
            return (
              <li key={song.id}>
                <Link
                  href={`/song/${song.id}/${firstVersion.id}`}
                  className="flex flex-col gap-0.5 bg-surface px-4 py-3 transition-colors hover:bg-border/60"
                >
                  <span className="font-medium text-text-primary">{song.title}</span>
                  <span className="text-sm text-text-secondary">{song.artist}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <footer className="mt-10 flex flex-col items-center gap-4">
        <Link
          href="/tuner"
          className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
        >
          <AudioLines className="h-4 w-4" />
          Afinador
        </Link>
        <a
          href="https://github.com/DanielMartinezSebastian/guitar-tabs-lyrics"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver repositorio en GitHub"
          className="text-text-secondary/50 transition-colors hover:text-text-secondary"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
