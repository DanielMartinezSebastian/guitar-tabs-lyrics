"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { TuningMeter } from "./tuning-meter";
import { cn } from "@/lib/utils";
import {
  TUNER_INSTRUMENTS,
  TUNINGS,
  centsBetween,
  closestString,
  nearestNoteName,
} from "@/lib/tuner";
import { usePitchDetector } from "@/lib/use-pitch-detector";

type TunerInstrument = (typeof TUNER_INSTRUMENTS)[number];

export function TunerScreen() {
  const [instrument, setInstrument] = useState<TunerInstrument>("guitar");
  const [selectedStringId, setSelectedStringId] = useState(TUNINGS.guitar.strings[0].id);
  const { status, frequency, error, start, stop } = usePitchDetector();

  const tuning = TUNINGS[instrument];
  const selectedString =
    tuning.strings.find((string) => string.id === selectedStringId) ?? tuning.strings[0];
  const closest = frequency !== null ? closestString(frequency, tuning.strings) : null;
  const cents = frequency !== null ? centsBetween(frequency, selectedString.frequency) : null;

  function handleInstrumentChange(next: TunerInstrument) {
    setInstrument(next);
    setSelectedStringId(TUNINGS[next].strings[0].id);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Volver al catálogo"
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold text-text-primary">Afinador</h1>
        </div>
        <div className="mt-3 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-md border border-border bg-surface p-1">
            {TUNER_INSTRUMENTS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleInstrumentChange(option)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                  instrument === option
                    ? "bg-accent text-black"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {TUNINGS[option].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-6xl font-bold tabular-nums text-text-primary">
            {frequency !== null ? nearestNoteName(frequency) : "—"}
          </span>
          <span className="text-sm text-text-secondary">
            {frequency !== null
              ? `${frequency.toFixed(1)} Hz`
              : status === "listening"
                ? "Escuchando..."
                : "Activa el micrófono para empezar"}
          </span>
        </div>

        <TuningMeter cents={cents} />

        <div className="flex flex-wrap justify-center gap-2">
          {tuning.strings.map((string) => {
            const isSelected = string.id === selectedStringId;
            const isClosest = closest?.id === string.id && !isSelected;
            return (
              <Button
                key={string.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-16 w-16 flex-col gap-0.5",
                  isClosest && "ring-2 ring-accent/50"
                )}
                onClick={() => setSelectedStringId(string.id)}
              >
                <span className="text-xs opacity-70">{string.position}ª</span>
                <span className="text-base font-semibold">{string.note}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-2">
          {status === "denied" && (
            <p className="text-center text-sm text-red-400">
              Permiso de micrófono denegado. Actívalo desde los ajustes del navegador para este
              sitio y vuelve a intentarlo.
            </p>
          )}
          {status === "error" && error && <p className="text-center text-sm text-red-400">{error}</p>}
          {status === "listening" ? (
            <Button type="button" variant="outline" className="gap-2" onClick={stop}>
              <MicOff className="h-4 w-4" />
              Detener
            </Button>
          ) : (
            <Button type="button" className="gap-2" onClick={start}>
              <Mic className="h-4 w-4" />
              Activar micrófono
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
