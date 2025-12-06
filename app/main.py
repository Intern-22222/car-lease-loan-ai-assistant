from fastapi import FastAPI

app = FastAPI(title="Contract Analysis Engine", version="0.1.0")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Backend stub is running"}