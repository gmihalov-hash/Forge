const CACHE = 'forgex-v27';

// Same-origin app shell – MUSÍ sa nainštalovať kompletne (addAll je atomický), inak install
// zlyhá zámerne. Toto je kritický minimálny set pre offline chod appky.
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon-512.png',
].map(url => new Request(url, { cache: 'reload' })); // bypass HTTP cache pri precachovaní → vždy čerstvé byty

// Cross-origin CDN liby – best-effort. Zlyhanie jednej (napr. CDN dočasne nedostupné presne
// počas installu) NESMIE zhodiť install celého app shellu, preto bežia oddelene cez allSettled.
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/umd/index.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
];

// ALLOWLIST hostov, ktoré SW vôbec smie cachovať. Všetko mimo same-origin + tohto zoznamu
// (Supabase API, AdSense, akákoľvek iná tretia strana) prechádza bez zásahu SW – žiadne
// cachovanie auth/session/user dát, žiadne cachovanie reklamného kódu (porušenie AdSense
// politiky + zaplnenie Cache Storage tisíckami meniacich sa ad-request URL).
const CACHEABLE_HOSTS = ['cdn.jsdelivr.net'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all([
      c.addAll(CORE_ASSETS),
      Promise.allSettled(
        CDN_ASSETS.map(url =>
          fetch(url, { mode: 'cors' }).then(res => {
            if (res && res.ok) return c.put(url, res);
          })
        )
      ),
    ]))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin && !CACHEABLE_HOSTS.includes(url.hostname)) return; // tretia strana → necachuj, default network

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached; // cache-first: okamžite, bez network round-tripu

      return fetch(e.request).then(res => {
        // opaque = cross-origin response bez CORS headerov – res.ok je tu vždy false, ale
        // response je platná a treba ju uložiť pre offline použitie.
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
