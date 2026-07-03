import { useState } from "react";
import { EditableSongContent } from "./editable-song-content";
import { Button } from "./ui/button";
import type { Instrument } from "@/lib/types";

export const INSTRUMENT_OPTIONS: { value: Instrument; label: string; defaultLabel: string }[] = [
  { value: "guitar", label: "Guitarra", defaultLabel: "Guitarra - estándar" },
  { value: "ukulele", label: "Ukelele", defaultLabel: "Ukelele - estándar" },
  { value: "other", label: "Otro", defaultLabel: "" },
];

export const fieldInputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent";

interface SongContentFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
  artist: string;
  onArtistChange: (value: string) => void;
  instrument: Instrument;
  onInstrumentChange: (value: Instrument) => void;
  label: string;
  onLabelChange: (value: string) => void;
  capo: string;
  onCapoChange: (value: string) => void;
  tuning: string;
  onTuningChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
}

/** Campos compartidos entre el formulario de "añadir" y el de "vista previa". */
export function SongContentFields({
  title,
  onTitleChange,
  artist,
  onArtistChange,
  instrument,
  onInstrumentChange,
  label,
  onLabelChange,
  capo,
  onCapoChange,
  tuning,
  onTuningChange,
  content,
  onContentChange,
}: SongContentFieldsProps) {
  const [assignMode, setAssignMode] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Título
          <input
            className={fieldInputClass}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Artista
          <input
            className={fieldInputClass}
            value={artist}
            onChange={(e) => onArtistChange(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Instrumento
          <select
            className={fieldInputClass}
            value={instrument}
            onChange={(e) => onInstrumentChange(e.target.value as Instrument)}
          >
            {INSTRUMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Capo (opcional)
          <input
            className={fieldInputClass}
            type="number"
            min={0}
            value={capo}
            onChange={(e) => onCapoChange(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Afinación (opcional)
          <input
            className={fieldInputClass}
            value={tuning}
            onChange={(e) => onTuningChange(e.target.value)}
            placeholder="standard"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Etiqueta de la versión
        <input
          className={fieldInputClass}
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          required
        />
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm text-text-secondary" htmlFor="song-content-textarea">
            Letra (los acordes en formato ChordPro son opcionales)
          </label>
          {content.trim() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAssignMode((value) => !value)}
            >
              {assignMode ? "Editar texto" : "Asignar acordes"}
            </Button>
          )}
        </div>

        {assignMode && content.trim() ? (
          <EditableSongContent content={content} onContentChange={onContentChange} />
        ) : (
          <textarea
            id="song-content-textarea"
            className={`${fieldInputClass} min-h-64 font-mono`}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={"Pega aquí la letra tal cual, con o sin acordes:\nHey Jude, don't make it bad\nTake a sad song and make it better\n\nO en formato ChordPro:\n[F]Hey Jude, don't make it [C]bad"}
            required
          />
        )}
      </div>
    </>
  );
}
