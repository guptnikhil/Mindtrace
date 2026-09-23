import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MindTrace — Student Wellbeing Companion API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & Secrets
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./wellbeing.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Allowed origins for CORS (no wildcards in production)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

settings = Settings()
