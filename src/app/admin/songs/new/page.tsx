import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AddSongForm } from "@/components/add-song-form";
import { isContentEditorEnabled } from "@/lib/content-editor";

export default function NewSongPage() {
  if (!isContentEditorEnabled()) notFound();

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
        <h1 className="text-lg font-semibold text-text-primary">Añadir canción</h1>
      </div>
      <AddSongForm />
    </div>
  );
}
