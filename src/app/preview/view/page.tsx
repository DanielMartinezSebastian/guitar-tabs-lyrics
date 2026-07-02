import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { SongReader } from "@/components/song-reader";
import { extractChords, parseChordPro } from "@/lib/chordpro";
import { decodePreviewPayload } from "@/lib/preview-encoding";
import { songRepository } from "@/lib/song-repository";

interface PreviewViewPageProps {
  searchParams: Promise<{ d?: string }>;
}

export default async function PreviewViewPage({ searchParams }: PreviewViewPageProps) {
  const { d } = await searchParams;
  if (!d) notFound();

  const payload = decodePreviewPayload(d);
  if (!payload) notFound();

  const dictionary = await songRepository.getChordDictionary(payload.instrument);
  const lines = parseChordPro(payload.content);
  const chords = extractChords(payload.content);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/preview"
            aria-label="Nueva vista previa"
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-semibold text-text-primary">
              {payload.title || "Vista previa"}
            </h1>
            {payload.artist && (
              <p className="truncate text-sm text-text-secondary">{payload.artist}</p>
            )}
          </div>
          <Link
            href={`/preview?d=${encodeURIComponent(d)}`}
            aria-label="Editar vista previa"
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            <Pencil className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <SongReader
        lines={lines}
        chords={chords}
        dictionary={dictionary}
        instrument={payload.instrument}
        capo={payload.capo}
      />
    </div>
  );
}
