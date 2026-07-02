import { notFound, redirect } from "next/navigation";
import { songRepository } from "@/lib/song-repository";

interface SongIndexPageProps {
  params: Promise<{ songId: string }>;
}

/** Redirige a la primera versión disponible de la canción. */
export default async function SongIndexPage({ params }: SongIndexPageProps) {
  const { songId } = await params;
  const song = await songRepository.getSong(songId);
  if (!song || song.versions.length === 0) notFound();

  redirect(`/song/${songId}/${song.versions[0].id}`);
}
