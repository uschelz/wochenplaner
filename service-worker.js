const CACHE_NAME = "wochenplaner-cache-v5";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-blau.png",
  "./icon-dunkelblau.png",
  "./icon-dunkelgruen.png",
  "./icon-olivgruen.png",
  "./icon-rot.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        FILES_TO_CACHE.map(function (url) {
          return cache.add(url).catch(function (error) {
            console.log("Konnte nicht gespeichert werden:", url, error);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      if (event.request.mode === "navigate") {
        return caches.match("./index.html");
      }

      return fetch(event.request).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
