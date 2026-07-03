"use client";

import { useEffect, useRef } from "react";
import { SVGuitarChord } from "svguitar";
import { cn } from "@/lib/utils";
import type { ChordDiagram as ChordDiagramData } from "@/lib/types";

interface ChordDiagramProps {
  name: string;
  diagram: ChordDiagramData;
  strings: number;
  highlighted?: boolean;
  className?: string;
}

export function ChordDiagram({
  name,
  diagram,
  strings,
  highlighted,
  className,
}: ChordDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fingers = diagram.frets.map((fret, index) => {
      const stringNumber = diagram.frets.length - index;
      return [stringNumber, fret] as [number, number | "x"];
    });

    const numericFrets = diagram.frets.filter(
      (fret): fret is number => typeof fret === "number"
    );
    const frets = Math.max(4, ...numericFrets);

    const chart = new SVGuitarChord(container);
    chart
      .configure({
        strings,
        frets,
        position: diagram.baseFret ?? 1,
        color: "#a1a1aa",
        stringColor: "#52525b",
        fretColor: "#52525b",
        fretLabelColor: "#a1a1aa",
        fingerColor: "#22c55e",
        fingerTextColor: "#09090b",
        backgroundColor: "none",
        titleFontSize: 0,
        sidePadding: 0.2,
      })
      .chord({ fingers, barres: [] })
      .draw();

    return () => chart.remove();
  }, [diagram, strings]);

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div ref={containerRef} className="w-14 [&>svg]:h-auto [&>svg]:w-full" />
      <span
        className={cn(
          "font-mono text-sm font-bold transition-colors",
          highlighted ? "text-accent" : "text-text-primary"
        )}
      >
        {name}
      </span>
    </div>
  );
}
