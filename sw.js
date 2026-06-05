/* Luisa Piccarreta PWA — Service Worker v1.0.0 */
const CACHE_NAME = 'luisa-v1.0.0';
const CORPUS_CACHE = 'luisa-corpus-v1.0.0';

const APP_SHELL = [
  './',
  './index.html',
  './corpus.json',
  'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== CORPUS_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Corpus JSON — cache-first, network fallback
  if (url.pathname.endsWith('corpus.json')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CORPUS_CACHE).then(c => c.put(event.request, clone));
        return resp;
      }))
    );
    return;
  }

  // Google Fonts & CDN — network-first, cache fallback
  if (url.hostname.includes('googleapis') || url.hostname.includes('gstatic') || url.hostname.includes('jsdelivr')) {
    event.respondWith(
      fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return resp;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell — cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// Background sync for user data (favoris, notes)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
