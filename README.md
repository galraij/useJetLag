# useJetLag ✈️

פלטפורמת בלוג טיולים מבוססת AI | MVC Architecture

## טכנולוגיות
- **Client:** React + Vite + Mantine + Zustand
- **Server:** Node.js + Express (MVC)
- **DB:** PostgreSQL
- **Storage:** Cloudinary
- **AI:** OpenAI GPT-4o Vision
- **EXIF:** exifr
- **Weather:** OpenWeather API

---

## דרישות מקדימות
- Node.js 18+
- PostgreSQL מותקן מקומית

### התקנת PostgreSQL
**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
הורד מ־ https://www.postgresql.org/download/windows/

**Ubuntu/Linux:**
```bash
sudo apt install postgresql
sudo service postgresql start
```

---

## התחלה מהירה

### 1. צור את מסד הנתונים
```bash
psql -U postgres
CREATE DATABASE usejetlag;
\q
```

### 2. Server — הגדרה
```bash
cd server
cp ../.env.example .env
# ערכי את .env (ראה הסבר למטה)
npm install
npm run migrate
npm run dev
```

### 3. Client — הגדרה
```bash
cd client
npm install
npm run dev
```

---

## משתני סביבה — server/.env

```env
PORT=3001
DB_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/usejetlag
JWT_SECRET=choose_any_long_random_string
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

OPENAI_API_KEY=...
OPENWEATHER_API_KEY=...
```

### איפה מקבלים את המפתחות?
| שירות | קישור |
|--------|-------|
| Cloudinary | https://cloudinary.com → Dashboard |
| OpenAI | https://platform.openai.com/api-keys |
| OpenWeather | https://openweathermap.org/api → Free plan |

---

## מבנה MVC
```
server/
├── models/      ← Model      — שאילתות SQL בלבד
├── views/       ← View       — עיצוב תגובות JSON
├── controllers/ ← Controller — לוגיקת request/response
├── routes/      ← ניתוב
├── services/    ← Cloudinary, OpenAI, Weather, Geocoding
├── middleware/  ← Auth, Admin, Upload, ErrorHandler
└── db/          ← Pool + Migrations
```

## API Endpoints
| Method | Route | הרשאה | תיאור |
|--------|-------|--------|-------|
| POST | /auth/register | פתוח | הרשמה |
| POST | /auth/login | פתוח | התחברות |
| POST | /upload | מחובר | העלאת תמונות ל-Cloudinary |
| POST | /posts/generate | מחובר | יצירת טקסט AI |
| POST | /posts | מחובר | שמירת פוסט |
| GET | /posts | פתוח | כל הפוסטים |
| GET | /posts/my | מחובר | הפוסטים שלי |
| GET | /posts/:id | פתוח | פוסט בודד |
| PATCH | /posts/:id | מחובר | עריכת פוסט |
| DELETE | /posts/:id | מחובר | מחיקת פוסט |
| GET | /admin/users | Admin | רשימת משתמשים |
| DELETE | /admin/posts/:id | Admin | מחיקה כ-Admin |
| PATCH | /admin/users/:id/block | Admin | חסימת משתמש |

---

## 🚀 Deployment (GitHub-Linked)

This project is optimized for deployment using **Vercel** (Frontend) and **Render** (Backend).

### 1. Backend (Render)
1. Create a "Web Service" on [Render](https://render.com).
2. Connect this GitHub repository.
3. **Root Directory**: `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   - `DB_URL`: Your Supabase/PostgreSQL connection string.
   - `JWT_SECRET`: A long random string.
   - `CLIENT_URL`: Your production Vercel URL (e.g., `https://usejetlag.vercel.app`).
   - `GEMINI_API_KEY`: Your Google AI key.
   - `CLOUDINARY_...`: Your Cloudinary credentials.
   - `OPENWEATHER_API_KEY`: Your weather key.

### 2. Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com).
2. Connect this GitHub repository.
3. **Root Directory**: `client`
4. **Framework Preset**: `Vite`
5. **Environment Variables**:
   - `VITE_API_URL`: Your production Render URL (e.g., `https://usejetlag-api.onrender.com`).

---

## License
MIT
