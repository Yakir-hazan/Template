# PWA Template — Yakir Hazan

תבנית PWA עברית מוכנה לפרויקט חדש.

## קבצים

| קובץ | תפקיד |
|------|--------|
| `landing.html` | דף נחיתה (App Store סגנון) — מוצג לביקור רגיל |
| `index.html` | האפליקציה עצמה — נפתחת רק מהאייקון (standalone) |
| `manifest.json` | הגדרות PWA |
| `sw.js` | Service Worker (cache + offline) |
| `vercel.json` | routing נכון ל-Vercel |

## התחלת פרויקט חדש

1. **חפש והחלף** את כל המחרוזות:
   - `APP_NAME` → שם האפליקציה
   - `APP_DESCRIPTION` → תיאור קצר
   - `APP_DEVELOPER` → השם שלך

2. **הוסף אייקונים:**
   - `/icon-192.png` (192×192)
   - `/icon-512.png` (512×512)

3. **עדכן צבעים** ב-CSS Variables בראש כל קובץ

4. **עדכן CACHE_NAME** ב-`sw.js` בכל deploy חדש

5. **Deploy ל-Vercel:**
   ```
   vercel --prod
   ```

## זרימת התקנה

```
משתמש נכנס ל-URL
      ↓
landing.html (דף הורדה)
      ↓ לוחץ "הוסף למסך הבית"
iOS: הוראות שיתוף   |   Android: beforeinstallprompt
      ↓                          ↓
מסך הבית — אייקון
      ↓ פותח
index.html (standalone mode ✅)
```
