from pydantic import BaseModel
from typing import Optional


class OCRRequest(BaseModel):
    filename: Optional[str] = None


class OCRResponse(BaseModel):
    message: str
    output_file: str
