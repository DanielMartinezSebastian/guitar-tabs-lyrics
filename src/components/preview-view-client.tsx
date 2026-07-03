"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Guitar } from "lucide-react";
import { SongReader } from "./song-reader";
import { EditableSongContent } from "./editable-song-content";
import { Button } from "./ui/button";
import { extractChords, parseChordPro } from "@/lib/chordpro";
import { encodePreviewPayload, type PreviewPayload } from "@/lib/preview-encoding";
import type { ChordDictionary } from "@/lib/types";

interface PreviewViewClientProps {
  payload: PreviewPayload;
  dictionary: ChordDictionary;
}

export function PreviewViewClient({ payload, dictionary }: PreviewViewClientProps) {
  const router = useRouter();
  const [content, setContent] = useState(payload.content);
  const [editing, setEditing] = useState(false);

  const lines = useMemo(() => parseChordPro(content), [content]);
  const chords = useMemo(() => extractChords(content), [content]);

  function handleContentChange(nextContent: string) {
    setContent(nextContent);
    const encoded = encodePreviewPayload({ ...payload, content: nextContent });
    router.replace(`/preview/view?d=${encoded}`, { scroll: false });
  }

  return (
    <>
      <div className="flex justify-end border-b border-border px-4 py-2">
        <Button
          variant="outline"
          size="sm"
          className={
            editing
              ? "whitespace-nowrap"
              : "whitespace-nowrap border-green-800 bg-green-950/40 text-green-400 hover:bg-green-900/50 hover:text-green-300"
          }
          onClick={() => setEditing((value) => !value)}
        >
          {editing ? (
            <>
              <BookOpen className="h-3.5 w-3.5" />
              Modo lectura
            </>
          ) : (
            <>
              <Guitar className="h-3.5 w-3.5" />
              Asignar acordes
            </>
          )}
        </Button>
      </div>

      {editing ? (
        <div className="flex-1 px-4 py-6">
          <EditableSongContent
            content={content}
            onContentChange={handleContentChange}
            dictionary={dictionary}
            instrument={payload.instrument}
          />
        </div>
      ) : (
        <SongReader
          lines={lines}
          chords={chords}
          dictionary={dictionary}
          instrument={payload.instrument}
          capo={payload.capo}
        />
      )}
    </>
  );
}
