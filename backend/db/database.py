from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


from sqlalchemy.orm import Session
from typing import Generator


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_connection():
    """Establish a PostgreSQL connection using psycopg2 with retry logic."""
    atmpt=1
    while  atmpt<=5:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Connected to PostgreSQL using sqlalchemy")
            return
        except Exception as e:
            print(f"Database connection failed: {e}")
            time.sleep(2)
            atmpt+=1
            
# model.Base.metadata.create_all(bind=engine)