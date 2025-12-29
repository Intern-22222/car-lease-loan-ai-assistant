import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path("db/ocr.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ocr_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT,
            raw_text TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_ocr_result(file_name, raw_text):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO ocr_results (file_name, raw_text, created_at)
        VALUES (?, ?, ?)
    """, (file_name, raw_text, datetime.now().isoformat()))
    conn.commit()
    conn.close()