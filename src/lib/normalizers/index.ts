import { normalizeCifraclub } from "./cifraclub";
import { normalizeGeneric } from "./generic";

/**
 * Convierte el texto importado (formato propio de la web de origen) al
 * formato de acordes inline `[Acorde]texto` que usa la app (ver
 * src/lib/chordpro.ts). Despacha según el dominio de la URL de origen.
 */
export function normalize(text: string, url: string): string {
  let hostname = "";
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    hostname = "";
  }

  if (hostname.endsWith("cifraclub.com") || hostname.endsWith("cifraclub.com.br")) {
    return normalizeCifraclub(text);
  }

  return normalizeGeneric(text);
}
