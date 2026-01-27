from pydantic import BaseModel
from typing import Optional, List, Literal


class UploadResponse(BaseModel):
    file_id: str
    filename: str

    class Config:
        from_attributes = True


class OCRResponse(BaseModel):
    file_id: str
    text_extracted: bool
    full_text: str

    class Config:
        from_attributes = True


# ---------- Milestone 4: Analysis & Fairness ----------

class RiskFactor(BaseModel):
    name: str
    severity: int  # 1–5
    description: str


class HiddenFee(BaseModel):
    fee_name: str
    amount: Optional[float] = None
    currency: Optional[str] = None
    frequency: Optional[str] = None  # e.g. "one-time", "monthly"
    clause_excerpt: Optional[str] = None


class PriceFactors(BaseModel):
    base_price: Optional[float] = None
    total_monthly_payment: Optional[float] = None
    total_due_at_signing: Optional[float] = None
    estimated_total_cost: Optional[float] = None
    currency: Optional[str] = None


class FairnessInfo(BaseModel):
    score: int
    rating: Literal["Fair", "Moderate", "Unfair"]
    explanation: str


class ContractAnalysisPayload(BaseModel):
    file_id: str
    risk_factors: List[RiskFactor]
    price_factors: PriceFactors
    hidden_fees: List[HiddenFee]
    fairness: FairnessInfo


class AnalysisResponse(ContractAnalysisPayload):
    pass


# ---------- Milestone 4: Chatbot ----------

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    file_id: str
    message: str
    history: Optional[List[ChatMessage]] = None
    intent: Optional[Literal["chat", "email"]] = "chat"


class ChatResponse(BaseModel):
    assistant_message: str
    counter_email_draft: Optional[str] = None
