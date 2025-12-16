from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from .database import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String, unique=True, index=True, nullable=False)
    filename = Column(String, nullable=False)
    s3_path = Column(String, nullable=True)
    text_path = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)
    ingested_at = Column(DateTime, default=datetime.utcnow)
