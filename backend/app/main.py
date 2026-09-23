from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine, Base

from app.api.routes import health, students, checkins, wellbeing, nudges, analytics, ai, counselling, chat, institution
from app.api.v1 import demo

# Auto-create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="MindTrace: Early-warning student wellbeing companion & pattern indicator API for engineering students."
)

# CORS configuration - Production explicit origins + Vercel preview regex match
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:.*|http://127\.0\.0\.1:.*|https://.*\.onrender\.com|https://.*\.railway\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Root / health endpoint under /api/health
app.include_router(health.router, prefix="/api")

# Include feature routers under /api
app.include_router(students.router, prefix="/api")
app.include_router(checkins.router, prefix="/api")
app.include_router(wellbeing.router, prefix="/api")
app.include_router(nudges.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(counselling.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(demo.router, prefix="/api")
app.include_router(institution.router, prefix="/api/institution")

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "disclaimer": "An early-warning wellbeing support system. Not a medical diagnosis or clinical assessment."
    }

@app.get("/health")
def top_level_health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
