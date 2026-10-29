const CACHE = "mali-tok-v1";
const FICHIERS = [
  "./",
  "./index.html",
  "./conditions.html",
  "./confidentialite.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copie = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copie));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
