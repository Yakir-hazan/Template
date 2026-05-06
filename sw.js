// ============================================================
//  שם האפליקציה — Service Worker
//  EDIT: עדכן CACHE_NAME בכל deploy
// ============================================================

const CACHE_NAME = 'app-v1.0.0';

// EDIT: הוסף את כל הקבצים הסטטיים שלך
const PRECACHE = [
  '/',
  '/index.html',
  '/landing.html',
  '/manifest.json',
  '/icon.png',
  '/icon-192.png',
  '/icon-512.png',
  /* '/app.js',   */
  /* '/style.css', */
];

// ===== התקנה =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(() => {
            console.warn('[SW] לא נטמן:', url);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ===== הפעלה — מחק cache ישן =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ===== Fetch — Cache First + Network Fallback =====
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // בקשות חיצוניות (APIs, CDN) — תמיד מהרשת
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // החזר מה-cache מיד, ועדכן ברקע
        fetch(event.request).then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, res));
          }
        }).catch(() => {});
        return cached;
      }

      // אין cache — נסה רשת
      return fetch(event.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      }).catch(() => {
        // אופליין לחלוטין — הגש index.html
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
