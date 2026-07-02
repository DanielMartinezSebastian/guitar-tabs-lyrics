import { NextResponse } from "next/server";
import { isContentEditorEnabled } from "@/lib/content-editor";
import { songRepository } from "@/lib/song-repository";
import type { Instrument } from "@/lib/types";

const INSTRUMENTS: Instrument[] = ["guitar", "ukulele", "other"];

export async function POST(request: Request) {
  if (!isContentEditorEnabled()) {
    return NextResponse.json(
      { error: "El editor de contenido está deshabilitado en este entorno." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const { title, artist, instrument, label, capo, tuning, content } = body as Record<
    string,
    unknown
  >;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Falta el título." }, { status: 400 });
  }
  if (typeof artist !== "string" || !artist.trim()) {
    return NextResponse.json({ error: "Falta el artista." }, { status: 400 });
  }
  if (typeof instrument !== "string" || !INSTRUMENTS.includes(instrument as Instrument)) {
    return NextResponse.json({ error: "Instrumento inválido." }, { status: 400 });
  }
  if (typeof label !== "string" || !label.trim()) {
    return NextResponse.json({ error: "Falta la etiqueta de la versión." }, { status: 400 });
  }
  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Falta el contenido (letra + acordes)." }, { status: 400 });
  }
  if (capo !== undefined && typeof capo !== "number") {
    return NextResponse.json({ error: "El capo debe ser un número." }, { status: 400 });
  }
  if (tuning !== undefined && typeof tuning !== "string") {
    return NextResponse.json({ error: "La afinación debe ser texto." }, { status: 400 });
  }

  const result = await songRepository.addVersion({
    title: title.trim(),
    artist: artist.trim(),
    instrument: instrument as Instrument,
    label: label.trim(),
    capo,
    tuning: tuning?.trim() || undefined,
    content,
  });

  return NextResponse.json(result, { status: 201 });
}
