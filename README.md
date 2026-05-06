# 📱 PWA Template — הממ"ד שלנו style

## 📁 מבנה הקבצים

```
/
├── landing.html     ← דף הנחיתה (המשתמש רואה זה ראשון בדפדפן)
├── index.html       ← האפליקציה עצמה (נפתחת רק ב-standalone)
├── manifest.json    ← הגדרות PWA (שם, אייקון, צבעים)
├── sw.js            ← Service Worker (cache, offline, push)
├── icon.png         ← אייקון ראשי (180x180 מינימום)
├── icon-192.png     ← אייקון Android
└── icon-512.png     ← אייקון splash screen
```

---

## ✅ צ'קליסט לפרויקט חדש

### 1. manifest.json
- [ ] `name` — שם מלא
- [ ] `short_name` — שם קצר (מקסימום 12 תווים)
- [ ] `description` — תיאור
- [ ] `background_color` + `theme_color` — צבע רקע / status bar
- [ ] אייקונים: icon-192.png + icon-512.png

### 2. landing.html — כל `<!-- EDIT: -->` בקובץ
- [ ] `<title>` + `<meta description>`
- [ ] OG tags (title, description, image URL)
- [ ] `apple-mobile-web-app-title`
- [ ] שם אפליקציה + tagline בheader
- [ ] מספרי stats (דירוג, מחיר, משתמשים)
- [ ] 4 מסכי פרוומו (phone-frame)
- [ ] רשימת פיצ'רים
- [ ] טקסט CTA תחתון
- [ ] תוכן modals (אודות / פרטיות / תנאים)
- [ ] לינק צור קשר

### 3. index.html — כל `<!-- EDIT: -->` בקובץ
- [ ] `<title>`
- [ ] OG tags
- [ ] `apple-mobile-web-app-title`
- [ ] כותרת hero + sub
- [ ] קארדים בגריד הבית (שמות + אייקונים)
- [ ] תוכן כל מסך (feature1–5)
- [ ] הגדרות
- [ ] לינק צור קשר ב-settings

### 4. sw.js
- [ ] `CACHE_NAME` — עדכן בכל deploy (v1.0.0 → v1.0.1)
- [ ] `STATIC_FILES` — הוסף את כל הנכסים שלך

### 5. Design Tokens
- [ ] עדכן `:root` CSS variables ב-landing.html + index.html לפלטת הצבעים שלך
- [ ] החלף `--primary`, `--secondary`, `--accent`
- [ ] החלף פונט בGoogle Fonts link

---

## 🔄 הזרימה

```
דפדפן → landing.html
    ↓
  isStandalone? → כן → index.html (מיידית)
    ↓ לא
  כפתור "הורד"
    ↓
  Android+Chrome → beforeinstallprompt זמין? → Native prompt
                                              → לא → popup ידני
  iOS Safari → popup ידני (Share → Add to Home Screen)
    ↓
  התקנה ✅
    ↓
  אייקון במסך הבית → index.html (standalone mode)
    ↓
  index.html guard → isStandalone? לא → חזרה ללanding
                                  כן → האפליקציה נפתחת 🚀
```

---

## 🐛 Debug

כדי לפתוח את index.html ישירות מדפדפן (בלי להתקין):
```
https://your-domain.com/index.html?pwa=1
```

---

## 📦 Deploy Checklist

- [ ] כל הקבצים ב-root של הדומיין (`/manifest.json`, `/sw.js`)
- [ ] HTTPS חובה לPWA
- [ ] בדוק ב-Chrome DevTools → Application → Manifest
- [ ] בדוק ב-Lighthouse → PWA audit
- [ ] עדכן `CACHE_NAME` ב-sw.js לפני כל deploy
