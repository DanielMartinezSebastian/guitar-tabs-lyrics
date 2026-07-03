"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
        <Button variant="outline" size="sm" onClick={() => setEditing((value) => !value)}>
          {editing ? "Volver a modo lectura" : "Asignar acordes"}
        </Button>
      </div>

      {editing ? (
        <div className="flex-1 px-4 py-6">
          <EditableSongContent content={content} onContentChange={handleContentChange} />
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
