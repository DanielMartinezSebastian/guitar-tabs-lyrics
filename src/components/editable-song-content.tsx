"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  appendChordSlot,
  parseChordPro,
  setWordChord,
  tokensToWords,
  type ChordWordUnit,
} from "@/lib/chordpro";
import { ChordAssignModal } from "./chord-assign-modal";
import { cn } from "@/lib/utils";
import type { ChordDictionary, Instrument } from "@/lib/types";

interface EditableSongContentProps {
  content: string;
  onContentChange: (content: string) => void;
  dictionary: ChordDictionary;
  instrument: Instrument;
}

interface TargetWord {
  lineIndex: number;
  wordIndex: number;
  chord: string | null;
  text: string;
}

/**
 * Todo botón de esta vista (palabra, hueco de espacio o hueco de ancho cero)
 * comparte la misma estructura de dos filas fijas —etiqueta de acorde
 * (h-[1.1em]) y contenido (h-[1.6em])— para que, sea cual sea su contenido,
 * todos midan exactamente lo mismo y se alineen en la misma línea visual.
 */
function WordSlot({ word, onClick }: { word: ChordWordUnit; onClick: () => void }) {
  const isPlaceholder = word.text === "";
  const isEmptyGap = word.isSpace && !word.chord;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaceholder ? "Asignar acorde en hueco vacío" : undefined}
      className={cn(
        "flex flex-col rounded",
        isPlaceholder ? "items-center px-1 text-text-secondary hover:text-accent" : "items-start",
        !isPlaceholder && "hover:bg-background hover:text-accent",
        isEmptyGap &&
          "border-b border-dashed border-border opacity-70 hover:border-accent hover:opacity-100"
      )}
    >
      <span className="block h-[1.1em] min-w-[0.6em] leading-[1.1em] text-[0.8em] font-bold text-accent">
        {word.chord}
      </span>
      <span className="flex h-[1.6em] items-center whitespace-pre-wrap">
        {isPlaceholder ? (
          word.chord ? (
            <span className="h-1 w-1 rounded-full bg-text-secondary" aria-hidden />
          ) : (
            <Plus className="h-3 w-3" />
          )
        ) : (
          word.text
        )}
      </span>
    </button>
  );
}

/** Vista editable: pega letra con o sin acordes y haz clic en una palabra, un hueco vacío o el + de una línea para asignarle un acorde. */
export function EditableSongContent({
  content,
  onContentChange,
  dictionary,
  instrument,
}: EditableSongContentProps) {
  const [target, setTarget] = useState<TargetWord | null>(null);
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const lines = useMemo(() => parseChordPro(content), [content]);

  function handleAddSlot(lineIndex: number) {
    const nextContent = appendChordSlot(content, lineIndex);
    const nextWords = tokensToWords(parseChordPro(nextContent)[lineIndex].tokens);
    const wordIndex = nextWords.length - 1;
    setPendingContent(nextContent);
    setTarget({ lineIndex, wordIndex, chord: null, text: "" });
  }

  function handleSave(chord: string | null) {
    if (!target) return;
    const base = pendingContent ?? content;
    onContentChange(setWordChord(base, target.lineIndex, target.wordIndex, chord));
    setPendingContent(null);
    setTarget(null);
  }

  function handleCancel() {
    setPendingContent(null);
    setTarget(null);
  }

  return (
    <div className="rounded-md border border-border bg-surface px-4 py-4 font-mono">
      <p className="mb-3 font-sans text-sm text-text-secondary">
        Haz clic en una palabra, en un hueco vacío o en el icono + para asignar un acorde.
      </p>

      {lines.map((line, lineIndex) => {
        const words = tokensToWords(line.tokens);
        const hasWords = words.some((word) => !word.isSpace && word.text !== "");

        return (
          <div
            key={lineIndex}
            className={cn(
              "flex flex-wrap items-end gap-x-1",
              !hasWords && "my-2"
            )}
          >
            {words.map((word, wordIndex) => (
              <WordSlot
                key={wordIndex}
                word={word}
                onClick={() =>
                  setTarget({ lineIndex, wordIndex, chord: word.chord || null, text: word.text })
                }
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddSlot(lineIndex)}
              aria-label="Añadir acorde al final de la línea"
              className="flex flex-col items-center rounded px-1 text-text-secondary opacity-40 hover:opacity-100 hover:text-accent"
            >
              <span className="block h-[1.1em]" aria-hidden />
              <span className="flex h-[1.6em] items-center">
                <Plus className="h-3 w-3" />
              </span>
            </button>
          </div>
        );
      })}

      {target && (
        <ChordAssignModal
          word={target.text}
          initialChord={target.chord ?? ""}
          dictionary={dictionary}
          instrument={instrument}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
