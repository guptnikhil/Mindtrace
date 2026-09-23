# MindTrace Database Architecture Audit

## Actual Database

SQLite

## Evidence

1. **SQLAlchemy Engine Configuration**:  
   In [`backend/app/db/database.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/db/database.py), the application instantiates a synchronous SQLAlchemy engine using:
   ```python
   connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
   engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, echo=False)
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
   ```
   `DATABASE_URL` defaults to `sqlite:///./mindtrace.db`.

2. **Automatic Table Initialization**:  
   In [`backend/app/main.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/main.py), database tables are automatically initialized on application startup:
   ```python
   Base.metadata.create_all(bind=engine)
   ```

3. **Zero Supabase Runtime Dependencies**:  
   - Neither `supabase` nor `@supabase/supabase-js` is listed in [`backend/requirements.txt`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/requirements.txt) or [`frontend/package.json`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/frontend/package.json).
   - Zero occurrences of `create_client` or Supabase SDK client calls exist in application logic.
   - Unused `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` variables have been scrubbed from [`backend/app/core/config.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/core/config.py).

## Final Architecture

```
React (Vite + TypeScript + Tailwind)
        ↓
FastAPI (Python)
        ↓
SQLAlchemy ORM
        ↓
SQLite (mindtrace.db)
```

## Supabase Status

Supabase is not part of the runtime architecture and all unnecessary Supabase dependencies/configuration have been removed.

## Environment Variables

Only the following server-side environment variables are required by the backend:

- `DATABASE_URL` (default: `sqlite:///./mindtrace.db`)
- `GEMINI_API_KEY`
- `ENVIRONMENT` (default: `development`)
- `FRONTEND_URLS` / `CORS_ORIGINS`
- `WHATSAPP_COUNSELLOR_NUMBER` (default: `+919876543210`)

No Supabase credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are needed or used.

## Persistence

All core domain entity data is stored and retrieved via SQLAlchemy ORM models mapped to SQLite tables:

| Entity | Model File | Table Name | Storage Mechanism |
|--------|------------|------------|-------------------|
| Students | [`app/models/student.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/student.py) | `students` | SQLite persistent records |
| Check-ins | [`app/models/checkin.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/checkin.py) | `checkins` | SQLite persistent records |
| Assessments | [`app/models/wellbeing.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/wellbeing.py) | `wellbeing_assessments` | SQLite persistent records |
| Nudges | [`app/models/nudge.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/nudge.py) | `nudges` | SQLite persistent records |
| Counsellors | [`app/models/counselling.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/counselling.py) | `counsellors` | SQLite seed/dynamic records |
| Availability Slots | [`app/models/counselling.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/counselling.py) | `availability_slots` | SQLite 15-min bookable slots |
| Appointments | [`app/models/counselling.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/counselling.py) | `appointments` | SQLite scheduled session records |
| Institution Admin | [`app/models/institution.py`](file:///Users/nikhilgupt/Downloads/wellbeing-companion-prototype/backend/app/models/institution.py) | `institution_admins` | SQLite admin credentials & token auth |

## Deployment Limitation

On ephemeral cloud deployment platforms (such as free-tier Render web services), local disk files (`mindtrace.db`) reset upon container redeploy or long idle restarts. For prototype and hackathon demonstration purposes, this SQLite architecture provides zero-latency deterministic execution, auto-seeded demo datasets, and seamless offline functionality without external third-party database dependencies.

## Tests

- **Backend Pytest Suite**: 21/21 passed (`PYTHONPATH=backend pytest backend/tests/`)
- **Frontend Build**: 0 errors (`npm run build` completed in ~800ms)
- **Frontend Lint**: 0 errors (`npm run lint` clean)
- **Database Initialization**: `Base.metadata.create_all(bind=engine)` initializes SQLite tables clean
- **Production API Flow**: Vercel Proxy → Render FastAPI → SQLite tested and verified operational

## Remaining Manual Steps

None. SQLite is fully configured as the sole runtime database.
