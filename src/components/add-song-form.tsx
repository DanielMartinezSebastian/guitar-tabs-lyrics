"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import type { AddVersionResult, Instrument } from "@/lib/types";

const INSTRUMENT_OPTIONS: { value: Instrument; label: string; defaultLabel: string }[] = [
  { value: "guitar", label: "Guitarra", defaultLabel: "Guitarra - estándar" },
  { value: "ukulele", label: "Ukelele", defaultLabel: "Ukelele - estándar" },
  { value: "other", label: "Otro", defaultLabel: "" },
];

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent";

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
        <code>data/</code> para que aparezcan también en producción.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Título
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Artista
          <input
            className={inputClass}
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Instrumento
          <select
            className={inputClass}
            value={instrument}
            onChange={(e) => handleInstrumentChange(e.target.value as Instrument)}
          >
            {INSTRUMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Capo (opcional)
          <input
            className={inputClass}
            type="number"
            min={0}
            value={capo}
            onChange={(e) => setCapo(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Afinación (opcional)
          <input
            className={inputClass}
            value={tuning}
            onChange={(e) => setTuning(e.target.value)}
            placeholder="standard"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Etiqueta de la versión
        <input
          className={inputClass}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Letra + acordes (ChordPro)
        <textarea
          className={`${inputClass} min-h-64 font-mono`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"[F]Hey Jude, don't make it [C]bad\n[F]Take a sad song and make it [C]better"}
          required
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar canción"}
      </Button>
    </form>
  );
}
