from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os

class Settings(BaseSettings):
    # API Keys
    OPENROUTER_API_KEY: str
    
    # Project Settings
    PROJECT_NAME: str = "LeaseIQ AI"
    UPLOAD_DIR: str = "temp_uploads"
    
    # Model Configuration (OpenRouter)
    # You can change this to any model OpenRouter supports
    AI_MODEL: str = "google/gemini-2.0-flash-001" 
    
    # This tells Pydantic to read from a .env file
    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    """
    Using lru_cache ensures we only read the .env file once, 
    making the app faster.
    """
    settings = Settings()
    
    # Automatically create the upload folder if it doesn't exist
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)
        
    return settings