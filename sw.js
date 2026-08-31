const CACHE_NAME = "aplikasi-utama-v27";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon.svg",
  "./images/logo.png",
  "./images/building.png",
  "./images/cover.jpg",
  "./images/absen_logo.jpg",
  "./images/pengajuan_logo.jpg",
  "./images/website_logo.jpg",
  "https://cdn.tailwindcss.com"
];

// Install Event - cache all core assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching core assets...");
        // Use allSettled to ensure that even if one resource (like Tailwind CDN) fails during initial offline build, the rest get cached.
        return Promise.allSettled(
          ASSETS.map(asset => 
            cache.add(asset).catch(err => console.warn(`Failed to cache ${asset}:`, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate strategy
// Serves cached content immediately for speed & offline access, while updating the cache in the background.
self.addEventListener("fetch", (e) => {
  // Only cache GET requests
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.log("[Service Worker] Fetch failed (probably offline); returning cache if available.", err);
        });

      return cachedResponse || fetchPromise;
    })
  );
});
