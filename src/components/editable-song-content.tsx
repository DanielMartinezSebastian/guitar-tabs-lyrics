"use client";

import { useMemo, useState } from "react";
import { parseChordPro, setWordChord, tokensToWords } from "@/lib/chordpro";
import { ChordAssignModal } from "./chord-assign-modal";

interface EditableSongContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

interface TargetWord {
  lineIndex: number;
  wordIndex: number;
  chord: string | null;
  text: string;
}

/** Vista editable: pega letra con o sin acordes y haz clic en una palabra para asignarle uno. */
export function EditableSongContent({ content, onContentChange }: EditableSongContentProps) {
  const [target, setTarget] = useState<TargetWord | null>(null);
  const lines = useMemo(() => parseChordPro(content), [content]);

  function handleSave(chord: string | null) {
    if (!target) return;
    onContentChange(setWordChord(content, target.lineIndex, target.wordIndex, chord));
    setTarget(null);
  }

  return (
    <div className="rounded-md border border-border bg-surface px-4 py-4 font-mono">
      <p className="mb-3 font-sans text-sm text-text-secondary">
        Haz clic en una palabra para asignarle un acorde.
      </p>

      {lines.map((line, lineIndex) => {
        const words = tokensToWords(line.tokens);
        const hasContent = words.some((word) => !word.isSpace && word.text !== "");
        if (!hasContent) return <div key={lineIndex} className="h-[1em]" aria-hidden />;

        return (
          <div key={lineIndex} className="flex flex-wrap items-end">
            {words.map((word, wordIndex) =>
              word.isSpace ? (
                <span key={wordIndex} className="leading-[1.6em] whitespace-pre-wrap">
                  {word.text}
                </span>
              ) : (
                <span key={wordIndex} className="flex flex-col items-start">
                  <span className="block h-[1.1em] leading-[1.1em] text-[0.8em] font-bold text-accent">
                    {word.chord}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTarget({ lineIndex, wordIndex, chord: word.chord, text: word.text })
                    }
                    className="rounded leading-[1.6em] whitespace-pre-wrap hover:bg-background hover:text-accent"
                  >
                    {word.text}
                  </button>
                </span>
              )
            )}
          </div>
        );
      })}

      {target && (
        <ChordAssignModal
          word={target.text}
          initialChord={target.chord ?? ""}
          onCancel={() => setTarget(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
