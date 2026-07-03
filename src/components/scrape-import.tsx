"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { fieldInputClass } from "./song-content-fields";
import { normalize } from "@/lib/normalizers";

const SECRET_STORAGE_KEY = "scrapeAccessSecret";

interface ScrapeImportProps {
  onImported: (markdown: string) => void;
  /** Texto actual del campo de contenido, para poder normalizarlo in situ. */
  currentText: string;
}

/**
 * Trae el texto de una URL vía Cloudflare Browser Rendering (/api/scrape) y lo
 * ofrece como borrador para el campo de contenido. En local funciona sin más
 * (ver .env.local.example); en producción el servidor exige además una clave
 * (SCRAPE_ACCESS_SECRET) porque la web es pública y sin login — esta caja la
 * pide una vez y la guarda en este navegador.
 */
export function ScrapeImport({ onImported, currentText }: ScrapeImportProps) {
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [needsSecret, setNeedsSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preNormalizeText, setPreNormalizeText] = useState<string | null>(null);

  useEffect(() => {
    setSecret(window.localStorage.getItem(SECRET_STORAGE_KEY) ?? "");
  }, []);

  function handleSecretChange(value: string) {
    setSecret(value);
    window.localStorage.setItem(SECRET_STORAGE_KEY, value);
  }

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret ? { "x-scrape-secret": secret } : {}),
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.status === 401) setNeedsSecret(true);
      if (!response.ok) throw new Error(data.error ?? "No se pudo importar la página.");
      setNeedsSecret(false);
      setPreNormalizeText(null);
      onImported(data.content as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  function handleNormalize() {
    setPreNormalizeText(currentText);
    onImported(normalize(currentText, url));
  }

  function handleUndoNormalize() {
    if (preNormalizeText === null) return;
    onImported(preNormalizeText);
    setPreNormalizeText(null);
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
      <p className="text-sm text-text-secondary">
        Importa el texto de una URL como borrador en el campo de abajo.
        Revísalo y edítalo antes de guardar — recuerda que el contenido de
        otras páginas puede tener derechos de autor.
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={`${fieldInputClass} flex-1`}
        />
        <Button type="button" variant="outline" disabled={loading} onClick={handleFetch}>
          {loading ? "Importando..." : "Importar"}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!currentText.trim()}
          onClick={handleNormalize}
        >
          Normalizar
        </Button>
        {preNormalizeText !== null && (
          <Button type="button" variant="outline" onClick={handleUndoNormalize}>
            Deshacer
          </Button>
        )}
      </div>
      {needsSecret && (
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Clave de acceso (solo hace falta en producción, se guarda en este navegador)
          <input
            type="password"
            value={secret}
            onChange={(e) => handleSecretChange(e.target.value)}
            className={fieldInputClass}
          />
        </label>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
