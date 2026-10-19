import os
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("CALLFLOW_DATABASE_URL", "")
    SUPABASE_URL: str = os.getenv("CALLFLOW_SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("CALLFLOW_SUPABASE_SERVICE_KEY", "")
    LLM_API_KEY: str = os.getenv("CALLFLOW_LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("CALLFLOW_LLM_MODEL", "gemini-2.0-flash")
    CORS_ORIGIN: str = os.getenv("CALLFLOW_CORS_ORIGIN", "*")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
