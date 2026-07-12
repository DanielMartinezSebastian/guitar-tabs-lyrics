"use client";

import { cn } from "@/lib/utils";

const TICKS = [-50, -25, 0, 25, 50];
const IN_TUNE_THRESHOLD = 5;
const CLOSE_THRESHOLD = 15;

interface TuningMeterProps {
  /** Desviación en cents respecto al objetivo, o null si no hay lectura clara. */
  cents: number | null;
}

/** Aguja horizontal de -50 a +50 cents, con color según qué tan afinada está la cuerda. */
export function TuningMeter({ cents }: TuningMeterProps) {
  const hasSignal = cents !== null;
  const clamped = hasSignal ? Math.max(-50, Math.min(50, cents)) : 0;
  const percent = 50 + (clamped / 50) * 50;
  const absCents = hasSignal ? Math.abs(cents) : Infinity;

  const indicatorClasses = !hasSignal
    ? "bg-text-secondary"
    : absCents <= IN_TUNE_THRESHOLD
      ? "bg-accent ring-8 ring-accent/25"
      : absCents <= CLOSE_THRESHOLD
        ? "bg-amber-400 ring-8 ring-amber-400/25"
        : "bg-red-400 ring-8 ring-red-400/25";

  return (
    <div className="w-full max-w-xs">
      <div className="relative h-2 rounded-full border border-border bg-surface">
        {TICKS.map((tick) => (
          <div
            key={tick}
            className={cn(
              "absolute top-1/2 w-px -translate-y-1/2 bg-border",
              tick === 0 ? "h-4 bg-text-secondary" : "h-2"
            )}
            style={{ left: `${50 + (tick / 50) * 50}%` }}
          />
        ))}
        <div
          className={cn(
            "absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-150",
            // La aguja sigue el pitch en vivo sin animación (instantánea, como
            // una aguja analógica real). Solo al perder la señal y volver al
            // centro se anima, para que ese regreso se sienta natural y no un salto.
            !hasSignal && "transition-[left] duration-500 ease-out",
            indicatorClasses
          )}
          style={{ left: `${percent}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-text-secondary">
        <span>-50</span>
        <span>0</span>
        <span>+50</span>
      </div>
    </div>
  );
}
