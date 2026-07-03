import { NextResponse } from "next/server";
import { isContentEditorEnabled } from "@/lib/content-editor";
import { BrowserRenderingError, fetchPageAsMarkdown } from "@/lib/browser-rendering";

/**
 * En local (npm run dev) confiamos en el mismo límite que el resto del
 * editor de contenido. En producción (Vercel, web pública sin login) exigimos
 * además una clave compartida vía SCRAPE_ACCESS_SECRET, para que no cualquier
 * visitante pueda gastar la cuota de Cloudflare Browser Rendering. Sin esa
 * variable configurada, el endpoint se queda cerrado en producción.
 */
function isAuthorized(request: Request): boolean {
  if (isContentEditorEnabled()) return true;
  const configuredSecret = process.env.SCRAPE_ACCESS_SECRET;
  if (!configuredSecret) return false;
  return request.headers.get("x-scrape-secret") === configuredSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Falta o es incorrecta la clave de acceso." }, { status: 401 });
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

  const { url } = body as Record<string, unknown>;
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Falta la URL." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Solo se admiten URLs http/https." }, { status: 400 });
  }

  try {
    const content = await fetchPageAsMarkdown(parsed.toString());
    return NextResponse.json({ content });
  } catch (err) {
    const message =
      err instanceof BrowserRenderingError ? err.message : "No se pudo importar la página.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
