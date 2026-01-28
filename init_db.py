
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "contractdb")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASS = os.getenv("DB_PASS", "manvi123")

def init_db():
    conn = None
    try:
        # Connect to default postgres database to check if contractdb exists
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database="postgres"
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cur.fetchone()
        if not exists:
            print(f"Creating database {DB_NAME}...")
            cur.execute(f"CREATE DATABASE {DB_NAME}")
        else:
            print(f"Database {DB_NAME} already exists.")
        
        cur.close()
        conn.close()
        
        # Connect to contractdb to create tables
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        cur = conn.cursor()
        
        # Create users table
        print("Creating users table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create contracts table
        print("Creating contracts table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contracts (
                id VARCHAR(255) PRIMARY KEY,
                file_path TEXT,
                text_path TEXT,
                extracted_text TEXT,
                ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                analysis_status VARCHAR(50) DEFAULT 'PENDING'
            )
        """)
        
        conn.commit()
        print("Database initialization successful!")
        
    except Exception as e:
        print(f"Database initialization failed: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    init_db()
