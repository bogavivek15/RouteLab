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
    DATABASE_URL: str = os.getenv("ROUTELAB_DATABASE_URL") or os.getenv("CALLFLOW_DATABASE_URL", "")
    SUPABASE_URL: str = os.getenv("ROUTELAB_SUPABASE_URL") or os.getenv("CALLFLOW_SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("ROUTELAB_SUPABASE_SERVICE_KEY") or os.getenv("CALLFLOW_SUPABASE_SERVICE_KEY", "")
    LLM_API_KEY: str = os.getenv("ROUTELAB_LLM_API_KEY") or os.getenv("CALLFLOW_LLM_API_KEY", "")
    _raw_model = os.getenv("ROUTELAB_LLM_MODEL") or os.getenv("CALLFLOW_LLM_MODEL", "gemini-3.8-flash")
    # Guard against obsolete models set in legacy Render or .env variables (e.g. 404 deprecated gemini-2.0-flash)
    LLM_MODEL: str = "gemini-3.8-flash" if _raw_model in ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro"] else _raw_model
    CORS_ORIGIN: str = os.getenv("ROUTELAB_CORS_ORIGIN") or os.getenv("CALLFLOW_CORS_ORIGIN", "*")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
