from fastapi import FastAPI

app = FastAPI(title="Placeholder Backend")

@app.get("/")
def root():
    return {"status": "Backend running"}
