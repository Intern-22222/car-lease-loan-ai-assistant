from pydantic import BaseModel
from typing import Optional

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    class Config:
        from_attributes = True  # Replaces orm_mode=True in newer Pydantic

class OCRResponse(BaseModel):
    file_id: str
    text_extracted: bool
    full_text: str  # Remove Optional/None - always return the string (empty or not)
    class Config:
        from_attributes = True
