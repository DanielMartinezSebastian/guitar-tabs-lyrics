import type { Instrument } from "./types";

export interface PreviewPayload {
  title: string;
  artist: string;
  instrument: Instrument;
  label: string;
  capo?: number;
  tuning?: string;
  content: string;
}

const INSTRUMENTS: Instrument[] = ["guitar", "ukulele", "other"];

function utf8ToBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToUtf8(input: string): string {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Codifica la vista previa en un string apto para query param. No hay
 * persistencia: la URL resultante *es* el dato, por eso es segura de
 * exponer siempre (incluso en producción/Vercel) sin escribir en disco.
 */
export function encodePreviewPayload(payload: PreviewPayload): string {
  return utf8ToBase64(JSON.stringify(payload));
}

export function decodePreviewPayload(encoded: string): PreviewPayload | null {
  try {
    const parsed = JSON.parse(base64ToUtf8(encoded));
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.title !== "string" ||
      typeof parsed.artist !== "string" ||
      typeof parsed.instrument !== "string" ||
      !INSTRUMENTS.includes(parsed.instrument) ||
      typeof parsed.label !== "string" ||
      typeof parsed.content !== "string" ||
      (parsed.capo !== undefined && typeof parsed.capo !== "number") ||
      (parsed.tuning !== undefined && typeof parsed.tuning !== "string")
    ) {
      return null;
    }
    return parsed as PreviewPayload;
  } catch {
    return null;
  }
}
