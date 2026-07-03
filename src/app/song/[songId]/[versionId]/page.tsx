import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { SongReader } from "@/components/song-reader";
import { VersionSwitcher } from "@/components/version-switcher";
import { extractChords, parseChordPro } from "@/lib/chordpro";
import { songRepository } from "@/lib/song-repository";

interface SongVersionPageProps {
  params: Promise<{ songId: string; versionId: string }>;
}

export default async function SongVersionPage({ params }: SongVersionPageProps) {
  const { songId, versionId } = await params;

  const song = await songRepository.getSong(songId);
  if (!song) notFound();

  const version = await songRepository.getVersion(songId, versionId);
  if (!version) notFound();

  const dictionary = await songRepository.getChordDictionary(version.instrument);
  const lines = parseChordPro(version.content);
  const chords = extractChords(version.content);

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
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-semibold text-text-primary">{song.title}</h1>
            <p className="truncate text-sm text-text-secondary">{song.artist}</p>
          </div>
        </div>
        {song.versions.length > 1 && (
          <div className="mt-3 flex justify-center">
            <VersionSwitcher
              songId={songId}
              versions={song.versions}
              currentVersionId={versionId}
            />
          </div>
        )}
      </header>

      <SongReader
        lines={lines}
        chords={chords}
        dictionary={dictionary}
        instrument={version.instrument}
        capo={version.capo}
      />
    </div>
  );
}
