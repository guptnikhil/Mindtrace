# MindTrace Final Production Smoke Test

## Deployment
Frontend: https://mindtrace-app-rho.vercel.app
Backend: https://mindtrace-jxh0.onrender.com

## API Architecture
Frontend → Vercel Edge Proxy (`/api/*`) → Render FastAPI Backend (`https://mindtrace-jxh0.onrender.com/api/*`) → SQLite Database (SQLAlchemy ORM)

## Tests
| Test | Status | Evidence |
|------|--------|----------|
| Backend Pytest Suite | PASS | 21/21 passed in 1.49s (`pytest backend/tests/`) |
| Frontend ESLint Audit | PASS | 0 errors (19 warnings) (`npm run lint`) |
| Frontend Vite Build | PASS | 0 errors, built bundle in 893ms (`npm run build`) |
| GET `/api/health` | PASS | HTTP 200 OK `{"status":"ok"}` via Vercel Proxy & Render |
| GET `/api/counsellors` | PASS | HTTP 200 OK returns Dr. Mehta and Dr. Sharma |
| GET `/api/counsellors/counsellor_mehta/availability` | PASS | HTTP 200 OK returns 8 available 15-min slots |
| POST `/api/appointments` | PASS | HTTP 201 Created returns appointment ID `35e803d7-...` & WhatsApp link |
| GET `/api/appointments?student_id=std_demo_riya` | PASS | HTTP 200 OK returns scheduled appointment array |
| POST `/api/chat` | PASS | HTTP 200 OK returns Gemini response & `safety_state: normal` |
| GET `/api/institution/overview` | PASS | HTTP 200 OK returns institutional aggregate data |
| N >= 10 Privacy Threshold | PASS | Aggregation threshold enforced on cohort & adoption statistics |
| WhatsApp Deep Link | PASS | Generates `wa.me` URL with clean operational message |

## CORS
Actual production origin: https://mindtrace-app-rho.vercel.app  
Allowed origin: `https://mindtrace-app-rho.vercel.app`, `https://.*\.vercel\.app`, `http://localhost:5173`  
OPTIONS result: HTTP 200 OK (Clean CORS headers returned for configured origins, `allow_origins=["*"]` eliminated)

## API Base URL
Actual value: `/api` (Vercel Edge rewrite rule in `vercel.json` forwards `/api/:path*` to `https://mindtrace-jxh0.onrender.com/api/:path*`)

## Appointment Flow
Status: PASS — End-to-end booking, slot validation, SQLite state update, and appointment retrieval operational.

## WhatsApp
Implementation: DEEP LINK (`wa.me`)

Actual tested flow:
1. Student confirms appointment with Dr. Mehta for 2026-09-23 at 16:00.
2. Backend generates `whatsapp_url`: `https://wa.me/919876543210?text=Hi%2C%20I%20requested%20a%20counselling%20session%20through%20MindTrace.%0A%0ACounsellor%3A%20Dr.%20Mehta%0ADate%3A%202026-09-23%0ATime%3A%2016%3A00%0A%0AI%27d%20like%20to%20confirm%20my%20session.`
3. Decoded message text:
   > "Hi, I requested a counselling session through MindTrace.
   > 
   > Counsellor: Dr. Mehta  
   > Date: 2026-09-23  
   > Time: 16:00  
   > 
   > I'd like to confirm my session."
4. Verification: Message contains zero burnout/risk scores, sleep logs, or diagnostic tags. Special characters and line breaks are fully URL-encoded.
Status: PASS

## Security
Status: PASS — No API keys in frontend assets, no service role keys exposed, CORS credentials matched to explicit origins, N>=10 aggregation active.

## Remaining Manual Steps
1. Verify WhatsApp desktop app / web link opening by clicking "Continue on WhatsApp" in browser UI.
2. Verify live Render environment variable (`GEMINI_API_KEY`) in Render Dashboard if live AI model switching is required.

## Final Verdict

PASS — production flow verified
