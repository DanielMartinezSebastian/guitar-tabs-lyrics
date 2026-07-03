import { NextResponse } from "next/server";
import { songRepository } from "@/lib/song-repository";
import type { Instrument } from "@/lib/types";

const INSTRUMENTS: Instrument[] = ["guitar", "ukulele", "other"];

/** Diccionario de acordes disponibles para un instrumento (mismos datos que ya se envían en la leyenda de /song/*). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ instrument: string }> }
) {
  const { instrument } = await params;
  if (!INSTRUMENTS.includes(instrument as Instrument)) {
    return NextResponse.json({ error: "Instrumento inválido." }, { status: 400 });
  }

  const dictionary = await songRepository.getChordDictionary(instrument as Instrument);
  return NextResponse.json(dictionary);
}
