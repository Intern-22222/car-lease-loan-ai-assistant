"""
Database Module for OCR Results Storage
SQLite database connection and operations for storing extracted text.
"""

import os
import sqlite3
from typing import Optional, Dict, Any, List
from datetime import datetime
from pathlib import Path

# Default database path
DEFAULT_DB_PATH = Path(__file__).parent.parent.parent / "data" / "ocr_results.db"


def get_db_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """
    Get a database connection.
    
    Args:
        db_path: Optional path to the database file. Uses default if not provided.
        
    Returns:
        SQLite database connection
    """
    if db_path is None:
        db_path = str(DEFAULT_DB_PATH)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(db_path) or ".", exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn


def init_db(db_path: Optional[str] = None) -> None:
    """
    Initialize the database with required tables.
    
    Args:
        db_path: Optional path to the database file.
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    
    # Create OCR results table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ocr_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_file TEXT NOT NULL,
            extracted_text TEXT NOT NULL,
            page_count INTEGER,
            character_count INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()


def save_ocr_result(
    source_file: str,
    extracted_text: str,
    page_count: int,
    character_count: int,
    db_path: Optional[str] = None
) -> int:
    """
    Save an OCR result to the database.
    
    Args:
        source_file: Name of the source PDF file
        extracted_text: The extracted text content
        page_count: Number of pages processed
        character_count: Number of characters in the text
        db_path: Optional path to the database file
        
    Returns:
        The ID of the inserted record
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO ocr_results (source_file, extracted_text, page_count, character_count)
        VALUES (?, ?, ?, ?)
    """, (source_file, extracted_text, page_count, character_count))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return record_id


def get_ocr_result(result_id: int, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Retrieve an OCR result by ID.
    
    Args:
        result_id: The ID of the record to retrieve
        db_path: Optional path to the database file
        
    Returns:
        Dictionary with the OCR result or None if not found
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM ocr_results WHERE id = ?", (result_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return None


def get_all_ocr_results(db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieve all OCR results from the database.
    
    Args:
        db_path: Optional path to the database file
        
    Returns:
        List of OCR result dictionaries
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM ocr_results ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def delete_ocr_result(result_id: int, db_path: Optional[str] = None) -> bool:
    """
    Delete an OCR result by ID.
    
    Args:
        result_id: The ID of the record to delete
        db_path: Optional path to the database file
        
    Returns:
        True if a record was deleted, False otherwise
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM ocr_results WHERE id = ?", (result_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    return deleted
