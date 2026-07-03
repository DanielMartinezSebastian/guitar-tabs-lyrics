import "server-only";

/**
 * Wrapper mínimo sobre el endpoint REST /markdown de Cloudflare Browser
 * Rendering (https://developers.cloudflare.com/browser-rendering/rest-api/markdown-endpoint/).
 * Requiere un token con permiso "Browser Rendering - Edit" y el account id,
 * ambos vía variables de entorno (ver .env.local.example).
 */
export class BrowserRenderingError extends Error {}

export async function fetchPageAsMarkdown(url: string): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new BrowserRenderingError(
      "Faltan CLOUDFLARE_ACCOUNT_ID y/o CLOUDFLARE_API_TOKEN en el entorno (ver .env.local.example)."
    );
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/markdown`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ url }),
    }
  );

  let data: { success?: boolean; result?: string; errors?: { message: string }[] };
  try {
    data = await response.json();
  } catch {
    throw new BrowserRenderingError("Cloudflare Browser Rendering devolvió una respuesta inválida.");
  }

  if (!response.ok || !data.success || typeof data.result !== "string") {
    throw new BrowserRenderingError(
      data.errors?.[0]?.message ?? `Cloudflare Browser Rendering falló (HTTP ${response.status}).`
    );
  }

  return data.result;
}
