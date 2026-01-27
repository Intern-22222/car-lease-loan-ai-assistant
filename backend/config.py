import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # File upload settings
    UPLOAD_DIR: str = "backend/temp_uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".txt"}
    
    # Fairness score thresholds
    EXCELLENT_SCORE: float = 85.0
    GOOD_SCORE: float = 70.0
    FAIR_SCORE: float = 55.0

# ✅ create instance FIRST
settings = Settings()

# ✅ then validate
if not settings.GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found. Please set it in .env file")
