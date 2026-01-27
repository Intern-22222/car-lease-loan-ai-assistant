import PyPDF2
from typing import Optional
from io import BytesIO

class PDFExtractor:
    @staticmethod
    def extract_text(file_content: bytes) -> Optional[str]:
        """
        Extract text from PDF file (bytes input)
        """
        try:
            pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
            text = ""

            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            return text.strip()

        except Exception as e:
            print(f"PDF Extraction Error: {str(e)}")
            return None

    @staticmethod
    def extract_text_from_path(file_path: str) -> Optional[str]:
        """
        Extract text from PDF file path (PRIMARY METHOD)
        """
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""

                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

                return text.strip()

        except Exception as e:
            print(f"PDF Extraction Error: {str(e)}")
            return None


pdf_extractor = PDFExtractor()
