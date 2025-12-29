from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Setup the Database Connection
# This creates a file named 'ocr_data.db' in your project folder
DATABASE_URL = "sqlite:///./ocr_data.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# 2. Create the Session Manager (This allows us to talk to the DB)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# 3. Define the "Model" (What our data looks like)
class ContractData(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    extracted_text = Column(Text)  # This stores the huge OCR text

# 4. Create the table automatically
Base.metadata.create_all(bind=engine)

def save_to_db(filename: str, text: str):
    """
    Task-1: Function to save OCR results to the database.
    """
    session = SessionLocal()
    try:
        new_record = ContractData(filename=filename, extracted_text=text)
        session.add(new_record)
        session.commit()
        print(f"✅ Database: Saved '{filename}' successfully.")
    except Exception as e:
        print(f"❌ Database Error: {e}")
    finally:
        session.close()