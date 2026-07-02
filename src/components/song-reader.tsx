"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus } from "lucide-react";
import { ChordLegend } from "./chord-legend";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";
import type { ChordProLine, ChordProToken } from "@/lib/chordpro";
import type { ChordDictionary, Instrument } from "@/lib/types";

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 28;
const FONT_SIZE_STEP = 2;
const DEFAULT_FONT_SIZE = 18;

const MIN_SPEED = 10;
const MAX_SPEED = 100;
const DEFAULT_SPEED = 30;

function isBlankLine(tokens: ChordProToken[]) {
  return tokens.length === 1 && tokens[0].chord === null && tokens[0].text === "";
}

function SongLine({
  tokens,
  onChordTap,
}: {
  tokens: ChordProToken[];
  onChordTap: (chord: string) => void;
}) {
  if (isBlankLine(tokens)) {
    return <div className="h-[1em]" aria-hidden />;
  }

  return (
    <div className="flex flex-wrap items-end">
      {tokens.map((token, index) => (
        <span key={index} className="flex flex-col items-start">
          <span className="block h-[1.1em] leading-[1.1em]">
            {token.chord && (
              <button
                type="button"
                onClick={() => onChordTap(token.chord!)}
                className="font-mono text-[0.8em] font-bold text-accent hover:text-accent-hover"
              >
                {token.chord}
              </button>
            )}
          </span>
          <span className="leading-[1.6em] whitespace-pre-wrap">{token.text}</span>
        </span>
      ))}
    </div>
  );
}

interface SongReaderProps {
  lines: ChordProLine[];
  chords: string[];
  dictionary: ChordDictionary;
  instrument: Instrument;
  capo?: number;
}

export function SongReader({
  lines,
  chords,
  dictionary,
  instrument,
  capo,
}: SongReaderProps) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [legendVisible, setLegendVisible] = useState(true);
  const [highlightedChord, setHighlightedChord] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const lastFrameTime = useRef<number | null>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0);

  useEffect(() => {
    if (!playing) return;

    let frameId: number;
    const step = (time: number) => {
      if (lastFrameTime.current !== null) {
        const deltaSeconds = (time - lastFrameTime.current) / 1000;
        window.scrollBy({ top: speed * deltaSeconds });
      }
      lastFrameTime.current = time;
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      lastFrameTime.current = null;
    };
  }, [playing, speed]);

  useEffect(() => {
    const panel = bottomPanelRef.current;
    if (!panel) return;

    const updateHeight = () => setBottomPanelHeight(panel.offsetHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(panel);
    return () => resizeObserver.disconnect();
  }, [legendVisible, chords.length]);

  return (
    <>
      <div className="flex-1 px-4 py-6" style={{ fontSize, paddingBottom: bottomPanelHeight }}>
        {capo ? (
          <p className="mb-4 font-sans text-sm text-text-secondary">
            Capo: {capo}
          </p>
        ) : null}
        <div className="font-mono">
          {lines.map((line, index) => (
            <SongLine key={index} tokens={line.tokens} onChordTap={setHighlightedChord} />
          ))}
        </div>
      </div>

      <div ref={bottomPanelRef} className="fixed inset-x-0 bottom-0 z-10">
        <ChordLegend
          chords={chords}
          dictionary={dictionary}
          instrument={instrument}
          highlightedChord={highlightedChord}
          visible={legendVisible}
          onToggleVisible={() => setLegendVisible((visible) => !visible)}
        />

        <div className="border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pausar autoscroll" : "Iniciar autoscroll"}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Slider
              value={[speed]}
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={5}
              onValueChange={([value]) => setSpeed(value)}
              className={cn(!playing && "opacity-50")}
              aria-label="Velocidad de autoscroll"
            />

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setFontSize((size) => Math.max(MIN_FONT_SIZE, size - FONT_SIZE_STEP))
                }
                aria-label="Reducir tamaño de letra"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setFontSize((size) => Math.min(MAX_FONT_SIZE, size + FONT_SIZE_STEP))
                }
                aria-label="Aumentar tamaño de letra"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
