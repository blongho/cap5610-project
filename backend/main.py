import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
from dotenv import load_dotenv
import fitz  # PyMuPDF
from openai import OpenAI

from pdf_utils import extract_text_from_pdf, split_into_sections
from llm import summarize_baseline, summarize_cot
# Load environment variables
load_dotenv()

# ───────────────────────────────────────────────────────────────
# FASTAPI APP + CORS
# ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Research Assistant",
    description="Research paper summarization with Chain-of-Thought prompting",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL = "openai/gpt-oss-120b"


# ───────────────────────────────────────────────────────────────
# REQUEST MODEL
# ───────────────────────────────────────────────────────────────
class SummarizeRequest(BaseModel):
    text: str
    use_cot: bool = False
    section_name: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    pdf_bytes = await file.read()
    full_text = extract_text_from_pdf(pdf_bytes)
    sections = split_into_sections(full_text)

    return {"sections": list(sections.keys()), "text_preview": full_text[:2000]}


@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="No text provided")

    if req.use_cot:
        summary = summarize_cot(req.text, req.section_name)
    else:
        summary = summarize_baseline(req.text, req.section_name)

    return {"summary": summary, "use_cot": req.use_cot, "model": MODEL}
