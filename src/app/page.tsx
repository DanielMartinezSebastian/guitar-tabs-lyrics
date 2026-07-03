import { Catalog } from "@/components/catalog";
import { isContentEditorEnabled } from "@/lib/content-editor";
import { songRepository } from "@/lib/song-repository";

export default async function HomePage() {
  const songs = await songRepository.listSongs();
  return <Catalog songs={songs} canAddSongs={isContentEditorEnabled()} />;
}
