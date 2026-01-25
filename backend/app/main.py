from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import market, upload, chat  # Added 'chat' here

app = FastAPI(title="LeaseIQ AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the routers
app.include_router(market.router, prefix="/api", tags=["Market Analysis"])
app.include_router(upload.router, prefix="/api", tags=["Documents"])
app.include_router(chat.router, prefix="/api", tags=["AI Chat"]) # Added this line

@app.get("/")
def health_check():
    return {"status": "online", "message": "LeaseIQ Foundation is ready"}