/*
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           SERVICE WORKER — TEMPLATE                         ║
 * ║  EDIT: שנה CACHE_NAME בכל עדכון גרסה                        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

/* ════════════════════════════════════════
   EDIT: עדכן את מספר הגרסה בכל deploy!
   ════════════════════════════════════════ */
var CACHE_NAME = 'app-v1.0.0';

/* ════════════════════════════════════════
   EDIT: רשימת הקבצים לשמירה אופליין
   הוסף כאן את כל הנכסים הסטטיים שלך
   ════════════════════════════════════════ */
var STATIC_FILES = [
  '/',
  '/Template/',
  '/Template/landing.html',
  '/Template/manifest.json',
  '/Template/icon.png',
  '/Template/icon-192.png',
  '/Template/icon-512.png',
  /* EDIT: הוסף קבצי JS, CSS, פונטים, תמונות */
  /* '/app.js', */
  /* '/style.css', */
  /* '/offline.html', */
];

/* ════════════════════════════════════════
   INSTALL — שמור קבצים סטטיים
   ════════════════════════════════════════ */
self.addEventListener('install', function(event) {
  console.log('[SW] Install:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      /* ignoreSearch: true מאפשר cache-hit גם עם query params */
      return cache.addAll(STATIC_FILES).catch(function(err) {
        console.warn('[SW] Cache addAll partial fail:', err);
      });
    }).then(function() {
      return self.skipWaiting(); /* הפעל SW חדש מיידית */
    })
  );
});

/* ════════════════════════════════════════
   ACTIVATE — מחק cache ישן
   ════════════════════════════════════════ */
self.addEventListener('activate', function(event) {
  console.log('[SW] Activate:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k)   { console.log('[SW] Delete old cache:', k); return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim(); /* קח שליטה על כל הטאבים מיד */
    })
  );
});

/* ════════════════════════════════════════
   FETCH — אסטרטגיית Cache First עם Network Fallback
   ════════════════════════════════════════ */
self.addEventListener('fetch', function(event) {
  var req = event.request;

  /* דלג על בקשות לא-GET */
  if (req.method !== 'GET') return;

  /* דלג על cross-origin (APIs חיצוניים, Firebase וכו') */
  if (!req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) {
        /* הגש מה-cache, ובמקביל עדכן ברקע (Stale-While-Revalidate) */
        fetchAndCache(req);
        return cached;
      }
      /* אין cache — נסה רשת */
      return fetchAndCache(req).catch(function() {
        /* אין רשת + אין cache — הגש offline fallback */
        if (req.destination === 'document') {
          return caches.match('/offline.html') ||
                 new Response('<h1>אין חיבור לאינטרנט</h1>', {
                   headers: { 'Content-Type': 'text/html; charset=utf-8' }
                 });
        }
        return new Response('', { status: 503 });
      });
    })
  );
});

function fetchAndCache(req) {
  return fetch(req).then(function(res) {
    /* שמור רק תשובות תקינות */
    if (!res || res.status !== 200 || res.type !== 'basic') return res;
    var clone = res.clone();
    caches.open(CACHE_NAME).then(function(c) { c.put(req, clone); });
    return res;
  });
}

/* ════════════════════════════════════════
   PUSH NOTIFICATIONS (אופציונלי)
   EDIT: הסר אם לא צריך
   ════════════════════════════════════════ */
self.addEventListener('push', function(event) {
  if (!event.data) return;
  var data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'התראה', {
      body:    data.body    || '',
      icon:    data.icon    || '/Template/icon-192.png',
      badge:   data.badge   || '/Template/icon-192.png',
      tag:     data.tag     || 'default',
      data:    data.url     || '/',
      vibrate: [200, 100, 200],
      dir:     'rtl',
      lang:    'he'
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var c of list) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});

/* ════════════════════════════════════════
   BACKGROUND SYNC (אופציונלי)
   EDIT: הסר אם לא צריך
   ════════════════════════════════════════ */
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  /* EDIT: לוגיקת סנכרון נתונים בזמן חזרת אינטרנט */
  return Promise.resolve();
}
