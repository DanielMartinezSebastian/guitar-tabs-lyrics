"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

const FFT_SIZE = 2048;
const MIN_FREQUENCY = 70;
const MAX_FREQUENCY = 500;
const CLARITY_THRESHOLD = 0.9;
const SMOOTHING_WINDOW = 5;

export type PitchDetectorStatus = "idle" | "listening" | "denied" | "error";

interface UsePitchDetectorResult {
  status: PitchDetectorStatus;
  /** Frecuencia suavizada en Hz, o null si no hay una lectura clara ahora mismo. */
  frequency: number | null;
  clarity: number;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

/**
 * Encapsula el ciclo de vida del micrófono para el afinador: pide permiso,
 * monta el grafo de Web Audio y corre un bucle de detección de pitch
 * (McLeod Pitch Method vía `pitchy`) hasta que se llama a `stop()` o se
 * desmonta el componente. `start()` debe invocarse desde un gesto de
 * usuario (requisito de Safari/iOS para crear un `AudioContext`).
 */
export function usePitchDetector(): UsePitchDetectorResult {
  const [status, setStatus] = useState<PitchDetectorStatus>("idle");
  const [frequency, setFrequency] = useState<number | null>(null);
  const [clarity, setClarity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);
  const historyRef = useRef<number[]>([]);
  const visibleRef = useRef(true);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    detectorRef.current = null;
    bufferRef.current = null;
    historyRef.current = [];
    setFrequency(null);
    setClarity(0);
    setStatus("idle");
  }, []);

  const tick = useCallback(function runTick() {
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    const detector = detectorRef.current;
    const audioContext = audioContextRef.current;

    if (analyser && buffer && detector && audioContext && visibleRef.current) {
      analyser.getFloatTimeDomainData(buffer);
      const [pitch, readingClarity] = detector.findPitch(buffer, audioContext.sampleRate);

      if (readingClarity >= CLARITY_THRESHOLD && pitch >= MIN_FREQUENCY && pitch <= MAX_FREQUENCY) {
        const history = historyRef.current;
        history.push(pitch);
        if (history.length > SMOOTHING_WINDOW) history.shift();
        const smoothed = history.reduce((sum, value) => sum + value, 0) / history.length;
        setFrequency(smoothed);
        setClarity(readingClarity);
      } else {
        historyRef.current = [];
        setFrequency(null);
        setClarity(0);
      }
    }

    rafRef.current = requestAnimationFrame(runTick);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Este navegador no permite acceder al micrófono.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      source.connect(analyser);
      analyserRef.current = analyser;

      bufferRef.current = new Float32Array(
        new ArrayBuffer(analyser.fftSize * Float32Array.BYTES_PER_ELEMENT)
      );
      detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);
      historyRef.current = [];

      setStatus("listening");
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setStatus("denied");
      } else {
        setStatus("error");
        setError(err instanceof Error ? err.message : "No se pudo acceder al micrófono.");
      }
    }
  }, [tick]);

  useEffect(() => {
    function handleVisibilityChange() {
      visibleRef.current = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { status, frequency, clarity, error, start, stop };
}
