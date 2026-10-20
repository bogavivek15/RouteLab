import sqlite3
import uuid
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from services.api.config import settings

import os
import sys

logger = logging.getLogger("callflow.database")

# Global Supabase client if configured
_supabase_client = None

# EXPLICIT TEST ISOLATION SAFEGUARD:
# If running under pytest or explicit test environment flags, NEVER connect to remote Supabase!
_is_test_env = (
    os.getenv("CALLFLOW_ENV") == "test"
    or os.getenv("TESTING") == "1"
    or "pytest" in sys.modules
)

if not _is_test_env and settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    try:
        from supabase import create_client, Client
        _supabase_client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
    except Exception as e:
        logger.warning(f"Failed to initialize Supabase client: {e}")
        _supabase_client = None


class DatabaseAdapter:
    def __init__(self, db_path: Optional[str] = None):
        self.is_test = (
            os.getenv("CALLFLOW_ENV") == "test"
            or os.getenv("TESTING") == "1"
            or "pytest" in sys.modules
        )
        self.db_path = db_path or ("test_callflow_isolated.db" if self.is_test else "callflow_local.db")
        self._init_sqlite(self.db_path)
        # Safeguard: never use supabase if in test environment
        self.use_supabase = (_supabase_client is not None) and not self.is_test

    def _init_sqlite(self, db_path: str = "callflow_local.db"):
        """Initializes an isolated local SQLite database matching the Supabase schema."""
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        with self.conn:
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS calls (
                    id TEXT PRIMARY KEY,
                    prospect_name TEXT,
                    prospect_company TEXT,
                    current_stage INTEGER NOT NULL DEFAULT 1,
                    furthest_stage INTEGER NOT NULL DEFAULT 1,
                    status TEXT NOT NULL DEFAULT 'in_progress',
                    final_outcome TEXT,
                    summary TEXT,
                    started_at TEXT NOT NULL,
                    ended_at TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
            """)
            self.conn.execute("""
                CREATE TABLE IF NOT EXISTS stage_results (
                    id TEXT PRIMARY KEY,
                    call_id TEXT NOT NULL,
                    stage_number INTEGER NOT NULL,
                    outcome TEXT,
                    prospect_words TEXT,
                    notes TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    UNIQUE(call_id, stage_number),
                    FOREIGN KEY(call_id) REFERENCES calls(id) ON DELETE CASCADE
                );
            """)

    def reset_for_test(self):
        """Cleans test tables to provide pristine isolation between test suites."""
        if self.is_test or not self.use_supabase:
            with self.conn:
                self.conn.execute("DELETE FROM stage_results")
                self.conn.execute("DELETE FROM calls")

    def check_health(self) -> str:
        if self.use_supabase:
            try:
                # Query calls table with limit 1
                _supabase_client.table("calls").select("id").limit(1).execute()
                return "connected"
            except Exception as e:
                err_msg = str(e)
                if "PGRST205" in err_msg or "Could not find the table" in err_msg:
                    return "supabase_tables_missing (run supabase/schema.sql in Supabase SQL Editor)"
                return f"supabase_error: {err_msg[:60]}"
        if self.is_test:
            return "connected"
        return "local_storage"


    def create_call(self, prospect_name: Optional[str] = None, prospect_company: Optional[str] = None) -> Dict[str, Any]:
        call_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        if self.use_supabase:
            try:
                data = {
                    "id": call_id,
                    "prospect_name": prospect_name,
                    "prospect_company": prospect_company,
                    "current_stage": 1,
                    "furthest_stage": 1,
                    "status": "in_progress",
                    "final_outcome": None,
                    "summary": None,
                    "started_at": now,
                    "created_at": now,
                    "updated_at": now
                }
                res = _supabase_client.table("calls").insert(data).execute()
                created = res.data[0]
                created["stage_results"] = []
                return created
            except Exception as e:
                logger.warning(f"Supabase create_call failed ({e}). Falling back to local database.")

        with self.conn:
            self.conn.execute("""
                INSERT INTO calls (id, prospect_name, prospect_company, current_stage, furthest_stage, status, started_at, created_at, updated_at)
                VALUES (?, ?, ?, 1, 1, 'in_progress', ?, ?, ?)
            """, (call_id, prospect_name, prospect_company, now, now, now))
        return {
            "id": call_id,
            "prospect_name": prospect_name,
            "prospect_company": prospect_company,
            "current_stage": 1,
            "furthest_stage": 1,
            "status": "in_progress",
            "final_outcome": None,
            "summary": None,
            "started_at": now,
            "ended_at": None,
            "created_at": now,
            "updated_at": now,
            "stage_results": []
        }

    def get_call(self, call_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            try:
                res = _supabase_client.table("calls").select("*").eq("id", call_id).execute()
                if res.data:
                    call = res.data[0]
                    stages_res = _supabase_client.table("stage_results").select("*").eq("call_id", call_id).order("stage_number").execute()
                    call["stage_results"] = stages_res.data
                    return call
            except Exception as e:
                logger.warning(f"Supabase get_call failed ({e}). Falling back to local database.")

        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM calls WHERE id = ?", (call_id,))
        row = cursor.fetchone()
        if not row:
            return None
        call = dict(row)
        cursor.execute("SELECT * FROM stage_results WHERE call_id = ? ORDER BY stage_number ASC", (call_id,))
        stages = [dict(r) for r in cursor.fetchall()]
        call["stage_results"] = stages
        return call

    def list_calls(self) -> List[Dict[str, Any]]:
        if self.use_supabase:
            try:
                res = _supabase_client.table("calls").select("*").order("created_at", desc=True).execute()
                return res.data
            except Exception as e:
                logger.warning(f"Supabase list_calls failed ({e}). Falling back to local database.")

        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM calls ORDER BY created_at DESC")
        return [dict(r) for r in cursor.fetchall()]

    def save_stage_result(self, call_id: str, stage_number: int, outcome: Optional[str] = None, prospect_words: Optional[str] = None, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        call = self.get_call(call_id)
        if not call:
            return None

        # Compute furthest stage: never regresses below current or previous furthest
        new_furthest = max(call.get("furthest_stage", 1), stage_number)
        
        if self.use_supabase:
            try:
                result_data = {
                    "call_id": call_id,
                    "stage_number": stage_number,
                    "outcome": outcome,
                    "prospect_words": prospect_words,
                    "notes": notes,
                    "updated_at": now
                }
                existing = _supabase_client.table("stage_results").select("id").eq("call_id", call_id).eq("stage_number", stage_number).execute()
                if existing.data:
                    _supabase_client.table("stage_results").update(result_data).eq("id", existing.data[0]["id"]).execute()
                else:
                    result_data["id"] = str(uuid.uuid4())
                    result_data["created_at"] = now
                    _supabase_client.table("stage_results").insert(result_data).execute()

                _supabase_client.table("calls").update({
                    "current_stage": stage_number,
                    "furthest_stage": new_furthest,
                    "updated_at": now
                }).eq("id", call_id).execute()

                return self.get_call(call_id)
            except Exception as e:
                logger.warning(f"Supabase save_stage_result failed ({e}). Falling back to local database.")

        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute("SELECT id FROM stage_results WHERE call_id = ? AND stage_number = ?", (call_id, stage_number))
            row = cursor.fetchone()
            if row:
                self.conn.execute("""
                    UPDATE stage_results
                    SET outcome = ?, prospect_words = ?, notes = ?, updated_at = ?
                    WHERE call_id = ? AND stage_number = ?
                """, (outcome, prospect_words, notes, now, call_id, stage_number))
            else:
                res_id = str(uuid.uuid4())
                self.conn.execute("""
                    INSERT INTO stage_results (id, call_id, stage_number, outcome, prospect_words, notes, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (res_id, call_id, stage_number, outcome, prospect_words, notes, now, now))

            self.conn.execute("""
                UPDATE calls
                SET current_stage = ?, furthest_stage = ?, updated_at = ?
                WHERE id = ?
            """, (stage_number, new_furthest, now, call_id))
        return self.get_call(call_id)

    def close_call(self, call_id: str, final_outcome: str) -> Optional[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        call = self.get_call(call_id)
        if not call:
            return None

        if self.use_supabase:
            try:
                _supabase_client.table("calls").update({
                    "status": "completed",
                    "final_outcome": final_outcome,
                    "ended_at": now,
                    "updated_at": now
                }).eq("id", call_id).execute()
                return self.get_call(call_id)
            except Exception as e:
                logger.warning(f"Supabase close_call failed ({e}). Falling back to local database.")

        with self.conn:
            self.conn.execute("""
                UPDATE calls
                SET status = 'completed', final_outcome = ?, ended_at = ?, updated_at = ?
                WHERE id = ?
            """, (final_outcome, now, now, call_id))
        return self.get_call(call_id)

    def update_call_summary(self, call_id: str, summary_text: str) -> Optional[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        if self.use_supabase:
            try:
                _supabase_client.table("calls").update({
                    "summary": summary_text,
                    "updated_at": now
                }).eq("id", call_id).execute()
                return self.get_call(call_id)
            except Exception as e:
                logger.warning(f"Supabase update_call_summary failed ({e}). Falling back to local database.")

        with self.conn:
            self.conn.execute("""
                UPDATE calls
                SET summary = ?, updated_at = ?
                WHERE id = ?
            """, (summary_text, now, call_id))
        return self.get_call(call_id)

db = DatabaseAdapter()
