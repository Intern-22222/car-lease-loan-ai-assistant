from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import logging
from app.services.openrouter_service import get_chat_response
from app.core.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Schemas ---
class ChatRequest(BaseModel):
    message: str
    filename: Optional[str] = None 

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_lease(request: ChatRequest, settings=Depends(get_settings)):
    file_path = None
    
    # 1. Robust Filename Check
    # We check if filename exists and isn't a "placeholder" string from the frontend
    placeholders = ["No Document", "null", "undefined", "None"]
    
    if request.filename and request.filename not in placeholders:
        try:
            # Securely resolve the filename
            safe_filename = os.path.basename(request.filename)
            potential_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
            
            # 2. Only assign file_path if the file is actually on the disk
            if os.path.exists(potential_path):
                file_path = potential_path
                logger.info(f"Chatting with context: {safe_filename}")
            else:
                logger.warning(f"File {safe_filename} expected but not found on disk. Falling back to general chat.")
        except Exception as e:
            logger.error(f"Error resolving path: {e}")
            file_path = None
    else:
        logger.info("General chat mode (no document context).")

    try:
        # 3. Call the service
        # Ensure your get_chat_response handles file_path=None (general knowledge mode)
        reply = await get_chat_response(request.message, file_path)
        return {"reply": reply}
        
    except Exception as e:
        logger.error(f"Chat API Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="I'm sorry, I'm having trouble processing that right now. Please try again."
        )