import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
});

export interface UploadResponse {
  file_id: string;
  filename: string;
}

export interface OCRResponse {
  file_id: string;
  text_extracted: boolean;
  full_text: string;
}

export interface AnalysisResponse {
  file_id: string;
  fairness: {
    score: number;
    rating: "Fair" | "Moderate" | "Unfair";
    explanation: string;
  };
  risk_factors: {
    name: string;
    severity: number;
    description: string;
  }[];
  price_factors: {
    base_price?: number;
    total_monthly_payment?: number;
    total_due_at_signing?: number;
    estimated_total_cost?: number;
    currency?: string;
  };
  hidden_fees: {
    fee_name: string;
    amount?: number;
    currency?: string;
    frequency?: string;
    clause_excerpt?: string;
  }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  assistant_message: string;
  counter_email_draft?: string | null;
}

export async function uploadContract(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<UploadResponse>("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function runOCR(fileId: string) {
  const res = await api.post<OCRResponse>(`/ocr/${fileId}`);
  return res.data;
}

export async function analyzeContract(fileId: string) {
  const res = await api.post<AnalysisResponse>(`/contracts/${fileId}/analyze`);
  return res.data;
}

export async function getAnalysis(fileId: string) {
  const res = await api.get<AnalysisResponse>(`/contracts/${fileId}/analysis`);
  return res.data;
}

export async function sendChat(
  fileId: string,
  message: string,
  history: ChatMessage[],
  intent: "chat" | "email" = "chat"
) {
  const res = await api.post<ChatResponse>(`/contracts/${fileId}/chat`, {
    file_id: fileId,
    message,
    history,
    intent,
  });
  return res.data;
}
