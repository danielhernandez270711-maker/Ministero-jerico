const CACHE_NAME = 'jerico-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
          if (response) return response;
          // Ignore cache misses for external CDNs (Tailwind, html2canvas, etc)
          return fetch(event.request).catch(() => {});
      })
  );
});