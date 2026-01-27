"""
Unit Tests for Database Module
Tests for backend/app/database.py
"""

import os
import sys
import pytest
import tempfile
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.app.database import (
    init_db,
    get_db_connection,
    save_ocr_result,
    get_ocr_result,
    get_all_ocr_results,
    delete_ocr_result
)


class TestDatabaseConnection:
    """Tests for database connection functions."""
    
    def test_get_connection(self, tmp_path):
        """Test getting a database connection."""
        db_path = str(tmp_path / "test.db")
        conn = get_db_connection(db_path)
        
        assert conn is not None
        conn.close()
        assert os.path.exists(db_path)
    
    def test_init_db_creates_table(self, tmp_path):
        """Test that init_db creates the required tables."""
        db_path = str(tmp_path / "test.db")
        init_db(db_path)
        
        conn = get_db_connection(db_path)
        cursor = conn.cursor()
        
        # Check that the table exists
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='ocr_results'"
        )
        result = cursor.fetchone()
        conn.close()
        
        assert result is not None
        assert result["name"] == "ocr_results"


class TestSaveOCRResult:
    """Tests for saving OCR results."""
    
    @pytest.fixture
    def db_path(self, tmp_path):
        """Create a temporary database for testing."""
        path = str(tmp_path / "test.db")
        init_db(path)
        return path
    
    def test_save_returns_id(self, db_path):
        """Test that saving a result returns an ID."""
        record_id = save_ocr_result(
            source_file="test.pdf",
            extracted_text="Sample text content",
            page_count=3,
            character_count=20,
            db_path=db_path
        )
        
        assert record_id is not None
        assert record_id > 0
    
    def test_save_multiple_records(self, db_path):
        """Test saving multiple records."""
        id1 = save_ocr_result("file1.pdf", "Text 1", 1, 6, db_path)
        id2 = save_ocr_result("file2.pdf", "Text 2", 2, 6, db_path)
        id3 = save_ocr_result("file3.pdf", "Text 3", 3, 6, db_path)
        
        assert id1 < id2 < id3


class TestGetOCRResult:
    """Tests for retrieving OCR results."""
    
    @pytest.fixture
    def db_with_data(self, tmp_path):
        """Create a database with sample data."""
        path = str(tmp_path / "test.db")
        init_db(path)
        
        # Add sample data
        save_ocr_result("doc1.pdf", "Document 1 text", 2, 15, path)
        save_ocr_result("doc2.pdf", "Document 2 text", 5, 15, path)
        
        return path
    
    def test_get_existing_result(self, db_with_data):
        """Test retrieving an existing record."""
        result = get_ocr_result(1, db_with_data)
        
        assert result is not None
        assert result["source_file"] == "doc1.pdf"
        assert result["extracted_text"] == "Document 1 text"
        assert result["page_count"] == 2
    
    def test_get_nonexistent_result(self, db_with_data):
        """Test retrieving a non-existent record."""
        result = get_ocr_result(999, db_with_data)
        
        assert result is None
    
    def test_get_all_results(self, db_with_data):
        """Test retrieving all records."""
        results = get_all_ocr_results(db_with_data)
        
        assert len(results) == 2


class TestDeleteOCRResult:
    """Tests for deleting OCR results."""
    
    @pytest.fixture
    def db_with_data(self, tmp_path):
        """Create a database with sample data."""
        path = str(tmp_path / "test.db")
        init_db(path)
        save_ocr_result("test.pdf", "Test text", 1, 9, path)
        return path
    
    def test_delete_existing_result(self, db_with_data):
        """Test deleting an existing record."""
        deleted = delete_ocr_result(1, db_with_data)
        
        assert deleted is True
        assert get_ocr_result(1, db_with_data) is None
    
    def test_delete_nonexistent_result(self, db_with_data):
        """Test deleting a non-existent record."""
        deleted = delete_ocr_result(999, db_with_data)
        
        assert deleted is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
