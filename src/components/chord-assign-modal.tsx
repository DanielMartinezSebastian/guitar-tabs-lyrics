"use client";

import { useMemo, useState } from "react";
import { ChordDiagram } from "./chord-diagram";
import { STRINGS_BY_INSTRUMENT } from "./chord-legend";
import { Button } from "./ui/button";
import { fieldInputClass } from "./song-content-fields";
import type { ChordDictionary, ChordDiagram as ChordDiagramData, Instrument } from "@/lib/types";

const EMPTY_DIAGRAM: ChordDiagramData = { frets: [] };

interface ChordAssignModalProps {
  word: string;
  initialChord: string;
  dictionary: ChordDictionary;
  instrument: Instrument;
  onSave: (chord: string | null) => void;
  onCancel: () => void;
}

export function ChordAssignModal({
  word,
  initialChord,
  dictionary,
  instrument,
  onSave,
  onCancel,
}: ChordAssignModalProps) {
  const [query, setQuery] = useState(initialChord);

  const allChords = useMemo(() => Object.keys(dictionary).sort(), [dictionary]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allChords;
    return allChords.filter((name) => name.toLowerCase().includes(q));
  }, [allChords, query]);

  const matchedChord = allChords.find((name) => name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-md border border-border bg-background p-4 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Asignar acorde"
      >
        <h2 className="mb-1 font-sans text-sm font-medium text-text-primary">Asignar acorde</h2>
        <p className="mb-3 font-sans text-sm text-text-secondary">
          Palabra: <span className="font-mono text-text-primary">{word || "(sin texto)"}</span>
        </p>

        <input
          className={fieldInputClass}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar acorde (ej. C, Am, F#m7)"
          onKeyDown={(event) => {
            if (event.key === "Enter") onSave(matchedChord ?? (query.trim() || null));
            if (event.key === "Escape") onCancel();
          }}
        />

        <div className="mt-3 grid flex-1 grid-cols-3 gap-3 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="col-span-3 py-4 text-center font-sans text-sm text-text-secondary">
              Ningún acorde del diccionario coincide con la búsqueda.
            </p>
          ) : (
            filtered.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onSave(name)}
                className={`rounded-md border p-2 transition-colors hover:border-accent ${
                  name === initialChord ? "border-accent" : "border-border"
                }`}
              >
                <ChordDiagram
                  name={name}
                  diagram={dictionary[name] ?? EMPTY_DIAGRAM}
                  strings={STRINGS_BY_INSTRUMENT[instrument]}
                  highlighted={name === initialChord}
                />
              </button>
            ))
          )}
        </div>

        {query.trim() && !matchedChord && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => onSave(query.trim())}
          >
            Usar «{query.trim()}» (sin diagrama todavía)
          </Button>
        )}

        <div className="mt-4 flex justify-end gap-2">
          {initialChord && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onSave(null)}>
              Quitar acorde
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
