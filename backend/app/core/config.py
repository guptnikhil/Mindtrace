import os
import json
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MindTrace — Student Wellbeing Companion API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & Secrets
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mindtrace.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    WHATSAPP_COUNSELLOR_NUMBER: str = os.getenv("WHATSAPP_COUNSELLOR_NUMBER", "+919919963335")
    
    # Allowed origins for CORS configuration
    FRONTEND_URLS: str = os.getenv("FRONTEND_URLS", "")
    
    @property
    def cors_origins(self) -> List[str]:
        defaults = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "https://mindtrace-app-rho.vercel.app",
            "https://mindtrace-app-git-main-guptnikhils-projects.vercel.app",
        ]
        raw = os.getenv("FRONTEND_URLS") or os.getenv("CORS_ORIGINS") or self.FRONTEND_URLS
        if not raw:
            return defaults
        
        parsed = []
        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
            except Exception:
                parsed = [s.strip() for s in raw.split(",") if s.strip()]
        else:
            parsed = [s.strip() for s in raw.split(",") if s.strip()]
            
        cleaned = [o.rstrip("/") for o in parsed if o != "*"]
        for d in defaults:
            if d not in cleaned:
                cleaned.append(d)
        return cleaned

settings = Settings()
