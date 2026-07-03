import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SongVersionSummary } from "@/lib/types";

interface VersionSwitcherProps {
  songId: string;
  versions: SongVersionSummary[];
  currentVersionId: string;
}

/**
 * Cambiar de versión navega a otra ruta; `scroll={false}` evita que Next
 * resetee el scroll al cambiar, que es justo el requisito de
 * specs/02-features.md ("no perder el scroll, best-effort").
 */
export function VersionSwitcher({
  songId,
  versions,
  currentVersionId,
}: VersionSwitcherProps) {
  if (versions.length <= 1) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border bg-surface p-1">
      {versions.map((version) => {
        const active = version.id === currentVersionId;
        return (
          <Link
            key={version.id}
            href={`/song/${songId}/${version.id}`}
            scroll={false}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-black"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {version.label}
          </Link>
        );
      })}
    </div>
  );
}
