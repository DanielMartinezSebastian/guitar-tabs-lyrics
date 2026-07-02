"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
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
    </div>
  );
}
