/**
 * Post-procesado del markdown que devuelve Cloudflare Browser Rendering.
 * Las páginas de letras (letras.com, cifraclub, etc.) traen mucho ruido de
 * navegación/footer alrededor del contenido real (letra + acordes): índices
 * de artistas, redes sociales, avisos legales, imágenes... Este módulo lo
 * filtra línea a línea con heurísticas conservadoras, para reducir cuánto
 * hay que borrar a mano después de importar.
 */

const FOOTER_LINE_PATTERNS: RegExp[] = [
  /eliminar anuncios/i,
  /studio sol/i,
  /©\s*\d{4}/,
  /^\(c\)\s*\d{4}/i,
  /^(redes sociales|herramientas|comunidad|suscripci[oó]n(es)?|descarga(r)? la app|todos los artistas|todas las (canciones|letras)|[ií]ndice de artistas|contacto|sobre (letras\.com|nosotros)|pol[ií]tica de privacidad|t[eé]rminos( y condiciones)? de uso|aviso legal|trabaja con nosotros|publicidad|anuncia aqu[ií])\s*[:.]?\s*$/i,
];

function containsUrl(line: string): boolean {
  return /https?:\/\/\S+/.test(line);
}

function isOnlyMarkdownLinks(line: string): boolean {
  const trimmed = line.trim();
  if (!/\[[^\]]*\]\(/.test(trimmed)) return false;
  const stripped = trimmed
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[|,\-•·\s]/g, "");
  return stripped.length === 0;
}

function isArtistIndexLine(line: string): boolean {
  const tokens = line.trim().split(/[\s,|•·]+/).filter(Boolean);
  if (tokens.length < 8) return false;
  const singleCharTokens = tokens.filter((token) => /^[A-ZÑ0-9#]$/.test(token));
  return singleCharTokens.length / tokens.length > 0.7;
}

function isJunkLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed === "") return false;
  if (containsUrl(trimmed)) return true;
  if (isOnlyMarkdownLinks(trimmed)) return true;
  if (isArtistIndexLine(trimmed)) return true;
  return FOOTER_LINE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function cleanScrapedMarkdown(raw: string): string {
  const kept = raw.split(/\r?\n/).filter((line) => !isJunkLine(line));

  const collapsed: string[] = [];
  let blankRun = 0;
  for (const line of kept) {
    if (line.trim() === "") {
      blankRun += 1;
      if (blankRun > 2) continue;
    } else {
      blankRun = 0;
    }
    collapsed.push(line);
  }

  return collapsed.join("\n").trim();
}
