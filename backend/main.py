from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/docs")
def docs_check():
    return {"message": "Swagger available"}
