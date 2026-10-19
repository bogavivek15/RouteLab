import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory or project root
_backend_env = Path(__file__).resolve().parent / ".env"
_root_env = Path(__file__).resolve().parent.parent.parent / ".env"

if _backend_env.exists():
    load_dotenv(_backend_env)
if _root_env.exists():
    load_dotenv(_root_env)
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
