import os

class Settings:
    PROJECT_NAME: str = "TRUSTBREAK AI"
    TAGLINE: str = "Break It Safely. Fix It. Trust It."
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./trustbreak.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "trustbreak-ai-super-secret-production-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
