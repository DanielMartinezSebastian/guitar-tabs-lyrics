"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChordDiagram } from "./chord-diagram";
import { Button } from "./ui/button";
import type { ChordDictionary, ChordDiagram as ChordDiagramData, Instrument } from "@/lib/types";

const STRINGS_BY_INSTRUMENT: Record<Instrument, number> = {
  guitar: 6,
  ukulele: 4,
  other: 6,
};

// Referencia estable: si es un objeto nuevo en cada render, el efecto que
// dibuja el SVG del acorde se re-dispara en cada re-render sin necesidad.
const EMPTY_DIAGRAM: ChordDiagramData = { frets: [] };

interface ChordLegendProps {
  chords: string[];
  dictionary: ChordDictionary;
  instrument: Instrument;
  highlightedChord: string | null;
  visible: boolean;
  onToggleVisible: () => void;
}

export function ChordLegend({
  chords,
  dictionary,
  instrument,
  highlightedChord,
  visible,
  onToggleVisible,
}: ChordLegendProps) {
  const chipRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightedChord && visible) {
      chipRefs.current[highlightedChord]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [highlightedChord, visible]);

  if (chords.length === 0) return null;

  return (
    <div className="border-t border-border bg-surface">
      <div className="flex items-center justify-between px-3 py-1">
        <span className="text-xs font-medium tracking-wide text-text-secondary uppercase">
          Acordes
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisible}
          aria-label={visible ? "Ocultar leyenda de acordes" : "Mostrar leyenda de acordes"}
        >
          {visible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      {visible && (
        <div className="flex gap-4 overflow-x-auto px-3 pb-3">
          {chords.map((chord) => (
            <div
              key={chord}
              ref={(el) => {
                chipRefs.current[chord] = el;
              }}
            >
              <ChordDiagram
                name={chord}
                diagram={dictionary[chord] ?? EMPTY_DIAGRAM}
                strings={STRINGS_BY_INSTRUMENT[instrument]}
                highlighted={chord === highlightedChord}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
