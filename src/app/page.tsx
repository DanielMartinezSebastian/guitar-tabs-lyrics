import { Catalog } from "@/components/catalog";
import { songRepository } from "@/lib/song-repository";

export default async function HomePage() {
  const songs = await songRepository.listSongs();
  return <Catalog songs={songs} />;
}
