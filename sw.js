/* Luisa Piccarreta PWA — Service Worker v1.3.9
   Strategy:
   - index.html → network-first, cache fallback (ensures updates propagate)
   - corpus.json → network-first, cache fallback
   - Icons / manifest → cache-first (static assets, versioned by cache name)
   - Google Fonts / CDN → stale-while-revalidate, never in install precache
*/
const CACHE_VERSION = 'luisa-v1.3.9';
const CORPUS_CACHE  = 'luisa-corpus-v1.3.9';

// ONLY local files — no external URLs that can fail install
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

// ── Install: precache app shell only ──────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // Activate immediately — page handles reload guard
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// ── Activate: purge old caches ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_VERSION && k !== CORPUS_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategies ──────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET
  if (event.request.method !== 'GET') return;

  // corpus.json → network-first, cache fallback (never stale)
  if (url.pathname.endsWith('corpus.json')) {
    event.respondWith(networkFirstCorpus(event.request));
    return;
  }

  // Google Fonts, jsDelivr → stale-while-revalidate (opportunistic)
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('jsdelivr.net')
  ) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // index.html → network-first so updates are immediate
  if (url.pathname === '/' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(networkFirstShell(event.request));
    return;
  }

  // App shell and local assets → cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
});

async function networkFirstCorpus(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CORPUS_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch(e) {
    console.warn('[SW] networkFirstCorpus failed:', e);
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: 'corpus_unavailable', letters: [] }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch(e) {
    console.warn('[SW] networkFirst failed:', e);
    return new Response('Offline — ressource non disponible', { status: 503 });
  }
}

async function networkFirstShell(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch(e) {
    console.warn('[SW] networkFirstShell failed:', e);
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      caches.open(CACHE_VERSION).then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);
  return cached || await networkPromise || new Response('', { status: 503 });
}

// Accept skip-waiting messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
