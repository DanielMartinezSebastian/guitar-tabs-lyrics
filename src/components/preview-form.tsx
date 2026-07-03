"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { SongContentFields, INSTRUMENT_OPTIONS } from "./song-content-fields";
import { ScrapeImport } from "./scrape-import";
import { decodePreviewPayload, encodePreviewPayload } from "@/lib/preview-encoding";
import type { Instrument } from "@/lib/types";

export function PreviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [initialPayload] = useState(() => {
    const encoded = searchParams.get("d");
    return encoded ? decodePreviewPayload(encoded) : null;
  });

  const [title, setTitle] = useState(initialPayload?.title ?? "");
  const [artist, setArtist] = useState(initialPayload?.artist ?? "");
  const [instrument, setInstrument] = useState<Instrument>(initialPayload?.instrument ?? "guitar");
  const [label, setLabel] = useState(initialPayload?.label ?? "Guitarra - estándar");
  const [capo, setCapo] = useState(
    initialPayload?.capo !== undefined ? String(initialPayload.capo) : ""
  );
  const [tuning, setTuning] = useState(initialPayload?.tuning ?? "");
  const [content, setContent] = useState(initialPayload?.content ?? "");

  function handleInstrumentChange(value: Instrument) {
    setInstrument(value);
    const preset = INSTRUMENT_OPTIONS.find((option) => option.value === value);
    if (preset?.defaultLabel) setLabel(preset.defaultLabel);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const encoded = encodePreviewPayload({
      title: title.trim() || "Vista previa",
      artist: artist.trim(),
      instrument,
      label: label.trim() || "Vista previa",
      capo: capo.trim() ? Number(capo) : undefined,
      tuning: tuning.trim() || undefined,
      content,
    });
    router.push(`/preview/view?d=${encoded}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          aria-label="Volver al catálogo"
          className="text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">Vista previa rápida</h1>
      </div>

      <p className="mb-4 rounded-md border border-border bg-surface p-3 text-sm text-text-secondary">
        Pega letra + acordes y tócala al momento. No se guarda en ningún
        catálogo ni servidor — todo el contenido vive en la URL de la vista
        previa que se genera, así que puedes cerrarla sin dejar rastro o
        guardar el enlace si quieres volver a abrirla.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ScrapeImport onImported={setContent} />

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

        <Button type="submit">Ver vista previa</Button>
      </form>
    </div>
  );
}
