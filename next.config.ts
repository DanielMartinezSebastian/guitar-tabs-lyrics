import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El catálogo vive en /data (fuera de src/) y se lee con fs en el
  // SongRepository; nos aseguramos de que Vercel lo incluya en el trace
  // del server aunque las rutas de archivo se resuelvan en runtime.
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
};

export default nextConfig;
