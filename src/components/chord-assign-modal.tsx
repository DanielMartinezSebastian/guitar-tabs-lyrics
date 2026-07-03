"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { fieldInputClass } from "./song-content-fields";

interface ChordAssignModalProps {
  word: string;
  initialChord: string;
  onSave: (chord: string | null) => void;
  onCancel: () => void;
}

export function ChordAssignModal({ word, initialChord, onSave, onCancel }: ChordAssignModalProps) {
  const [chord, setChord] = useState(initialChord);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-md border border-border bg-background p-4 shadow-lg"
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
          autoFocus
          className={fieldInputClass}
          value={chord}
          onChange={(event) => setChord(event.target.value)}
          placeholder="Ej. C, Am, F#m7"
          onKeyDown={(event) => {
            if (event.key === "Enter") onSave(chord.trim() || null);
            if (event.key === "Escape") onCancel();
          }}
        />
        <div className="mt-4 flex justify-end gap-2">
          {initialChord && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onSave(null)}>
              Quitar acorde
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" size="sm" onClick={() => onSave(chord.trim() || null)}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
