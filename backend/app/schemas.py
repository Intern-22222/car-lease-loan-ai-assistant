from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    file_id: str
    filename: str

    class Config:
        orm_mode = True


class OCRResponse(BaseModel):
    file_id: str
    text_extracted: bool
    text_preview: Optional[str] = None

    class Config:
        orm_mode = True
