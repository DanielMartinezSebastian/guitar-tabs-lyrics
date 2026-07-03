/**
 * Fallback para dominios sin parser específico: no sabemos cómo esa web
 * codifica los acordes, así que nos limitamos a una limpieza básica de
 * espacios sin tocar el contenido.
 */
export function normalizeGeneric(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .trim();
}
