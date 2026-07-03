/**
 * El editor de contenido escribe directamente en /data del proyecto local.
 * En un despliegue serverless (Vercel) el filesystem es de solo lectura, así
 * que se deshabilita salvo que se habilite explícitamente para un
 * self-host personal (ENABLE_CONTENT_EDITOR=1).
 */
export function isContentEditorEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_CONTENT_EDITOR === "1";
}
