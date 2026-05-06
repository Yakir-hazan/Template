// ============================================================
//  APP_NAME — Service Worker
//  עדכן CACHE_NAME בכל deploy
// ============================================================

const CACHE_NAME = 'app-v1.0.0';

const PRECACHE = [
  '/',
  '/index.html',
  '/landing.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  /* '/app.css', */
  /* '/app.js',  */
];

// ===== התקנה =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => console.warn('[SW] לא נטמן:', url)))
      )
    ).then(() => self.skipWaiting())
  );
});

// ===== הפעלה — מחק cache ישן =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ===== Fetch — Stale While Revalidate =====
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // רענן cache ברקע
      const networkFetch = fetch(event.request).then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        }
        return res;
      }).catch(() => null);

      // החזר cache מיידית אם קיים, אחרת חכה לרשת
      return cached || networkFetch || caches.match('/index.html');
    })
  );
});
