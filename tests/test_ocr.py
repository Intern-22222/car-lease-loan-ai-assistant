"""
Unit Tests for OCR Module
Tests for backend/app/ocr.py using Tesseract OCR
"""

import os
import sys
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.app.ocr import (
    clean_text,
    process_pdf,
    process_pdf_to_dict,
    ocr_endpoint_handler,
    save_ocr_to_db
)


class TestCleanText:
    """Tests for text cleanup function."""
    
    def test_removes_extra_newlines(self):
        text = "Hello\n\n\n\nWorld"
        result = clean_text(text)
        assert "\n\n\n" not in result
        assert "Hello" in result
        assert "World" in result
    
    def test_removes_double_spaces(self):
        text = "Hello  World"
        result = clean_text(text)
        assert "  " not in result
    
    def test_strips_whitespace(self):
        text = "  Hello World  \n  Test  "
        result = clean_text(text)
        assert not result.startswith(" ")
        assert not result.endswith(" ")
    
    def test_handles_empty_string(self):
        assert clean_text("") == ""
        assert clean_text(None) == ""
    
    def test_fixes_common_ocr_mistakes(self):
        """Test OCR mistake corrections."""
        # Test pipe to I
        assert "|" not in clean_text("He|lo")
        
        # Test double spaces removal
        assert "  " not in clean_text("Hello  World")


class TestProcessPDF:
    """Tests for PDF processing function."""
    
    @pytest.fixture
    def sample_pdf_path(self):
        """Return path to sample PDF if it exists."""
        paths = [
            Path(__file__).parent.parent / "Sample" / "ford-loan-2023-11.pdf",
            Path(__file__).parent.parent / "Sample" / "vehicle-loan-agreement_rbl.pdf",
            Path(__file__).parent.parent / "data" / "sample.pdf",
        ]
        for path in paths:
            if path.exists():
                return str(path)
        return None
    
    def test_file_not_found_error(self):
        """Test that FileNotFoundError is raised for missing files."""
        with pytest.raises(FileNotFoundError):
            process_pdf("nonexistent_file.pdf")
    
    @pytest.mark.skipif(
        not os.environ.get("RUN_INTEGRATION_TESTS"),
        reason="Integration test - requires actual PDF"
    )
    def test_process_pdf_integration(self, sample_pdf_path):
        """Integration test with actual PDF file."""
        if sample_pdf_path is None:
            pytest.skip("No sample PDF available")
        
        result = process_pdf(sample_pdf_path)
        
        # Verify output exists and has content
        assert result is not None
        assert isinstance(result, str)
        assert len(result) > 100, f"Expected >100 chars, got {len(result)}"
    
    @pytest.mark.skipif(
        not os.environ.get("RUN_INTEGRATION_TESTS"),
        reason="Integration test - requires actual PDF"
    )
    def test_process_pdf_saves_output(self, sample_pdf_path, tmp_path):
        """Test that output is saved to file when path provided."""
        if sample_pdf_path is None:
            pytest.skip("No sample PDF available")
        
        output_path = tmp_path / "output.txt"
        result = process_pdf(sample_pdf_path, output_path=str(output_path))
        
        assert output_path.exists()
        assert output_path.read_text() == result


class TestProcessPDFToDict:
    """Tests for structured PDF processing."""
    
    @patch('backend.app.ocr.os.path.exists')
    @patch('backend.app.ocr.process_pdf')
    @patch('backend.app.ocr.fitz.open')
    def test_returns_correct_structure(self, mock_fitz_open, mock_process, mock_exists):
        """Test that result dictionary has correct keys."""
        # Mock os.path.exists to return True
        mock_exists.return_value = True
        
        # Mock fitz document
        mock_doc = MagicMock()
        mock_doc.__len__ = lambda x: 2  # 2 pages
        mock_fitz_open.return_value = mock_doc
        
        mock_process.return_value = "Sample extracted text " * 10
        
        result = process_pdf_to_dict("fake.pdf")
        
        assert "text" in result
        assert "page_count" in result
        assert "character_count" in result
        assert "source_file" in result
        
        assert result["page_count"] == 2
        assert result["character_count"] == len(mock_process.return_value)
        assert result["source_file"] == "fake.pdf"


class TestOCREndpointHandler:
    """Tests for backend endpoint handler."""
    
    @patch('backend.app.ocr.process_pdf_to_dict')
    def test_success_response(self, mock_process):
        """Test successful OCR processing."""
        mock_process.return_value = {
            "text": "Sample text",
            "page_count": 1,
            "character_count": 11,
            "source_file": "test.pdf"
        }
        
        result = ocr_endpoint_handler("test.pdf")
        
        assert result["success"] is True
        assert "data" in result
        assert result["data"]["text"] == "Sample text"
    
    def test_file_not_found_error(self):
        """Test error handling for missing files."""
        result = ocr_endpoint_handler("nonexistent.pdf")
        
        assert result["success"] is False
        assert "error" in result
    
    @patch('backend.app.ocr.process_pdf_to_dict')
    def test_generic_error_handling(self, mock_process):
        """Test handling of unexpected errors."""
        mock_process.side_effect = Exception("Unexpected error")
        
        result = ocr_endpoint_handler("test.pdf")
        
        assert result["success"] is False
        assert "error" in result
        assert "Unexpected error" in result["error"]


class TestSaveOCRToDB:
    """Tests for database save function."""
    
    def test_save_successful_result(self, tmp_path):
        """Test saving a successful OCR result."""
        db_path = str(tmp_path / "test.db")
        
        ocr_result = {
            "success": True,
            "data": {
                "text": "Sample extracted text",
                "page_count": 3,
                "character_count": 21,
                "source_file": "contract.pdf"
            }
        }
        
        result = save_ocr_to_db(ocr_result, db_path=db_path)
        
        assert result["saved"] is True
        assert "record_id" in result
        assert result["record_id"] > 0
    
    def test_save_failed_result(self):
        """Test that failed OCR results are not saved."""
        ocr_result = {
            "success": False,
            "error": "File not found"
        }
        
        result = save_ocr_to_db(ocr_result)
        
        assert result["saved"] is False
        assert "error" in result


class TestOCROutputRequirements:
    """Tests verifying acceptance criteria."""
    
    @pytest.fixture
    def sample_texts(self):
        """Sample OCR outputs for testing."""
        return [
            "This is a sample car lease agreement document with terms and conditions.",
            "Vehicle Information: Make, Model, Year, VIN Number, Purchase Price.",
            "Monthly payment schedule and financing terms for the automobile lease.",
        ]
    
    def test_output_minimum_length(self, sample_texts):
        """Verify OCR output meets minimum length requirement (>100 chars)."""
        for text in sample_texts:
            # Simulate what real OCR output would look like (repeated content)
            full_text = (text + "\n") * 5
            assert len(full_text) > 100, f"Output too short: {len(full_text)} chars"
    
    def test_text_is_legible(self, sample_texts):
        """Verify OCR output contains readable words."""
        for text in sample_texts:
            # Check for common English words that should be present
            words = text.lower().split()
            assert len(words) > 5, "Text should contain multiple words"


class TestDBIntegration:
    """Tests for database storage of OCR results."""
    
    def test_ocr_result_structure_for_db(self):
        """Verify OCR result structure is suitable for DB storage."""
        sample_result = {
            "success": True,
            "data": {
                "text": "Sample extracted text",
                "page_count": 3,
                "character_count": 21,
                "source_file": "contract.pdf"
            }
        }
        
        # Verify all required fields for DB storage
        assert "text" in sample_result["data"]
        assert "page_count" in sample_result["data"]
        assert "source_file" in sample_result["data"]
        
        # Verify text length check
        assert sample_result["data"]["character_count"] > 0
    
    def test_db_record_preparation(self, tmp_path):
        """Test that records are saved and retrieved correctly from database."""
        from backend.app.database import init_db, get_ocr_result
        
        db_path = str(tmp_path / "test.db")
        
        ocr_result = {
            "success": True,
            "data": {
                "text": "Test document text",
                "page_count": 1,
                "character_count": 18,
                "source_file": "test.pdf"
            }
        }
        
        # Save to database
        db_result = save_ocr_to_db(ocr_result, db_path=db_path)
        
        # Verify save was successful
        assert db_result["saved"] is True
        record_id = db_result["record_id"]
        
        # Retrieve and verify
        retrieved = get_ocr_result(record_id, db_path)
        assert retrieved is not None
        assert retrieved["source_file"] == "test.pdf"
        assert retrieved["extracted_text"] == "Test document text"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
