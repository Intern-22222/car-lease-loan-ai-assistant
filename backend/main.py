from fastapi import FastAPI
from backend.db.database import get_db_connection
from backend.routers import upload


app=FastAPI(title="Car lease")
app.include_router(upload.router)


@app.get("/home")
def read_home():
    return {
        "Welcom to Car lease application check"
    }


@app.on_event("startup")
def event_start():
    get_db_connection()