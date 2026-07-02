const CACHE_NAME = "tabs-lyrics-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// Network-first con fallback a caché: las páginas/recursos que ya se
// visitaron una vez online quedan disponibles offline. No precachea todo
// el catálogo por adelantado (ver specs/04-visual-style.md, pendiente).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match("/")))
  );
});
