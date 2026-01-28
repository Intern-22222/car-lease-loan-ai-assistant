import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # HuggingFace settings (replaced Gemini)
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    HF_MODEL: str = os.getenv("HF_MODEL", "Qwen/Qwen2.5-7B-Instruct")
    
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
if not settings.HF_TOKEN:
    import warnings
    warnings.warn("⚠️ HF_TOKEN not found in .env file. AI features will be limited.")
