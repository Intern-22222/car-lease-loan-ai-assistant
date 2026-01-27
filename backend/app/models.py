from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON as JSONType
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


# Use JSONB if on Postgres, otherwise regular JSON type
JSONColumn = JSONB if hasattr(JSONB, "__module__") else JSONType


class ContractAnalysis(Base):
    __tablename__ = "contract_analysis"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False, index=True)
    file_id = Column(String, index=True, nullable=False)
    analysis_json = Column(JSONColumn, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
