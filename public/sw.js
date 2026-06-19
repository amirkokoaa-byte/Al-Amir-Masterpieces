const CACHE_NAME = 'islamic-app-cache-v1';
const AUDIO_CACHE = 'islamic-audio-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== AUDIO_CACHE) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Exclude non-GET requests and chrome-extension
  if (event.request.method !== 'GET' || url.startsWith('chrome-extension')) {
    return;
  }

  // Handle Audio files (Cache First for offline saved)
  if (url.endsWith('.mp3') || url.includes('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          // If the url is explicitly saved, it will be in AUDIO_CACHE.
          // By default, we don't cache ALL audio automatically to save space,
          // but we can cache it temporarily or just return.
          return response;
        }).catch(() => {
          return new Response(null, { status: 404 });
        });
      })
    );
    return;
  }

  // API calls and Static assets (Stale-While-Revalidate or Network First)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch((e) => {
        console.log('Network request failed, serving from cache if available', e);
      });
      return cachedResponse || fetchPromise;
    })
  );
});
