from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.db.database import Base, get_db, get_db_connection, engine
from backend.routers import price_estim, upload, compare_file
from backend.routers import login
from backend.db import model

from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(title="Car lease")

from sqlalchemy import text

# @app.get("/dev/drop-users")
# def drop_users(db: Session = Depends(get_db)):
#     db.execute(text("DROP TABLE IF EXISTS users"))
#     db.commit()
#     return {"status": "users table dropped"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"],    
)



Base.metadata.create_all(bind=engine) 
app.include_router(upload.router)
app.include_router(login.router)
app.include_router(price_estim.router)
app.include_router(compare_file.router)


@app.get("/")
def read_home():
    return {
        "Welcom to Car lease application check  Move to /login path to login or create user": "  ",
    }


@app.on_event("startup")
def event_start():
    get_db_connection()