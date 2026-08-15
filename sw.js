/* Luisa Piccarreta PWA — Service Worker v2.2.3
   LET-G strategy:
   - index.html / navigation shell → network-first with HTTP-cache bypass, cache fallback
   - corpus.json → network-first with HTTP-cache bypass, cache fallback
   - local static assets → cache-first
   - optional Google Fonts / pinned Tabler CDN → stale-while-revalidate; local typography/icon fallbacks exist
   - a failed install fails closed, leaving the previously active worker/app intact
*/
const SHELL_CACHE = 'luisa-letters-shell-v2.2.3';
const CORPUS_CACHE = 'luisa-letters-corpus-v2.2.3';
const APP_CACHE_PREFIX = 'luisa-letters-';
const CANONICAL_SHELL_URL = './index.html';
const CORPUS_URL = './corpus.json';
const LEGACY_OWNED_CACHE_PATTERNS = [/^luisa-v1\./, /^luisa-corpus-v1\./];

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

function isOwnedCacheName(name) {
  return name.startsWith(APP_CACHE_PREFIX) || LEGACY_OWNED_CACHE_PATTERNS.some(rx => rx.test(name));
}

async function freshFetch(urlOrRequest) {
  const request = typeof urlOrRequest === 'string'
    ? new Request(urlOrRequest, {cache:'reload'})
    : new Request(urlOrRequest, {cache:'reload'});
  const response = await fetch(request);
  if (!response || !response.ok) throw new Error('fresh_fetch_failed:' + request.url + ':' + (response && response.status));
  return response;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const shellCache = await caches.open(SHELL_CACHE);
    const corpusCache = await caches.open(CORPUS_CACHE);
    // cache:'reload' prevents stale browser HTTP-cache bytes from seeding a new release cache.
    for (const url of APP_SHELL) {
      const response = await freshFetch(url);
      await shellCache.put(url, response.clone());
    }
    // Precache the protected corpus in its own cache before install can succeed. This closes
    // the activation/offline gap where the old corpus cache could be removed before the new
    // page had a chance to fetch corpus.json under the new worker.
    const corpusResponse = await freshFetch(CORPUS_URL);
    await corpusCache.put(CORPUS_URL, corpusResponse.clone());
    // Deliberately do not skipWaiting here. The running app remains in control until explicit activation.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(name => isOwnedCacheName(name) && name !== SHELL_CACHE && name !== CORPUS_CACHE)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  if (url.origin === self.location.origin && url.pathname.endsWith('corpus.json')) {
    event.respondWith(networkFirstCorpus(event.request));
    return;
  }

  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('jsdelivr.net')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  if (url.origin === self.location.origin && (url.pathname === '/' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/'))) {
    event.respondWith(networkFirstShell(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request));
  }
});

async function networkFirstCorpus(request) {
  try {
    const response = await fetch(request, {cache:'no-store'});
    if (response.ok) {
      const cache = await caches.open(CORPUS_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({error:'corpus_unavailable',letters:[]}), {status:503,headers:{'Content-Type':'application/json'}});
  }
}

async function networkFirstShell(request) {
  try {
    const response = await fetch(request, {cache:'no-store'});
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      // Store every successful navigation response under one canonical shell key instead of
      // proliferating one cache entry per deep-link query string.
      await cache.put(CANONICAL_SHELL_URL, response.clone());
    }
    return response;
  } catch (e) {
    // A deep link such as ?letter=... or a manifest shortcut must still open offline even when
    // that exact query URL was never visited online.
    const cached = await caches.match(request) || await caches.match(CANONICAL_SHELL_URL) || await caches.match('./');
    return cached || new Response('Offline', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response('Offline — ressource non disponible', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkPromise = fetch(request).then(async response => {
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  return cached || await networkPromise || new Response('', {status:503});
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
