"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { INSTRUMENT_OPTIONS, SongContentFields } from "./song-content-fields";
import { ScrapeImport } from "./scrape-import";
import type { AddVersionResult, Instrument } from "@/lib/types";

export function AddSongForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [instrument, setInstrument] = useState<Instrument>("guitar");
  const [label, setLabel] = useState("Guitarra - estándar");
  const [capo, setCapo] = useState("");
  const [tuning, setTuning] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AddVersionResult | null>(null);

  function handleInstrumentChange(value: Instrument) {
    setInstrument(value);
    const preset = INSTRUMENT_OPTIONS.find((option) => option.value === value);
    if (preset?.defaultLabel) setLabel(preset.defaultLabel);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          instrument,
          label,
          capo: capo.trim() ? Number(capo) : undefined,
          tuning: tuning.trim() || undefined,
          content,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo guardar la canción.");

      setResult(data as AddVersionResult);
      setTitle("");
      setArtist("");
      setCapo("");
      setTuning("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-md border border-border bg-surface p-4">
        <p className="font-medium text-text-primary">Canción guardada.</p>
        <p className="mt-1 text-sm text-text-secondary">
          Archivo creado en <code>data/versions/{result.songId}-{result.versionId}.json</code>.
        </p>
        {result.missingChords.length > 0 && (
          <p className="mt-2 text-sm text-text-secondary">
            Estos acordes no tienen diagrama todavía en el diccionario:{" "}
            <span className="font-mono text-accent">{result.missingChords.join(", ")}</span>.
            Pídeme que los añada, o edítalos a mano en{" "}
            <code>data/chords/{instrument}.json</code>.
          </p>
        )}
        <div className="mt-4 flex gap-3">
          <Link href={`/song/${result.songId}/${result.versionId}`}>
            <Button>Ver canción</Button>
          </Link>
          <Button variant="outline" onClick={() => setResult(null)}>
            Añadir otra
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="rounded-md border border-border bg-surface p-3 text-sm text-text-secondary">
        Esto escribe directamente en <code>data/</code> de tu copia local del
        proyecto. Solo funciona ejecutando <code>npm run dev</code> en tu
        máquina — no está disponible en el despliegue de Vercel. Después de
        añadir canciones, haz commit y push de los cambios en{" "}
        <code>data/</code> para que aparezcan también en producción.{" "}
        ¿Solo quieres tocarla ahora sin guardarla? Usa{" "}
        <Link href="/preview" className="text-accent hover:text-accent-hover">
          la vista previa
        </Link>
        .
      </p>

      <ScrapeImport onImported={setContent} currentText={content} />

      <SongContentFields
        title={title}
        onTitleChange={setTitle}
        artist={artist}
        onArtistChange={setArtist}
        instrument={instrument}
        onInstrumentChange={handleInstrumentChange}
        label={label}
        onLabelChange={setLabel}
        capo={capo}
        onCapoChange={setCapo}
        tuning={tuning}
        onTuningChange={setTuning}
        content={content}
        onContentChange={setContent}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar canción"}
      </Button>
    </form>
  );
}
