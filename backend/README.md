# 📘 Backend — AI Research Assistant

## Setup

### Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

If no file:

```bash
pip install fastapi "uvicorn[standard]" PyMuPDF python-dotenv python-multipart openai
```

---

#  Fix PDF Parsing Issues

Ensure correct library installed:

```bash
pip uninstall fitz -y
pip install PyMuPDF
```

PyMuPDF supplies the correct `fitz` module.

---

# Environment Variables

Create `backend/.env` with:

```
OPENAI_API_KEY=YOUR_KEY
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=openai/gpt-oss-120b # the paper suggests that CoT works best for models with params > 100B 
```

Supports any OpenAI-compatible endpoint.

---

# Run FastAPI Locally

```bash
uvicorn main:app --reload --port 8000
```

API runs at:

```
http://localhost:8000
```

Swagger docs:

```
http://localhost:8000/docs
```

---

# Endpoints

### `POST /upload-pdf`

* Accepts PDF file
* Extracts text + section names
* Returns preview text and section list

### `POST /summarize`

* Accepts text + section + CoT flag
* Sends prompt to LLM
* Returns summary

---

# Testing

Use Swagger:

```
http://localhost:8000/docs
```

Or Postman / curl:

```bash
curl -X POST -F "file=@paper.pdf" http://localhost:8000/upload-pdf
```

---

# CORS Configuration

Ensure the frontend is allowed:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

# ⚠️ 9. Troubleshooting

### ❌ "fitz has no attribute open"

✔ Wrong package installed → reinstall PyMuPDF.

### ❌ "openai.RateLimitError"

✔ Check OpenAI provider keys.

### ❌ Model not found

✔ Change `OPENAI_MODEL` to supported model.

### ❌ CORS blocked request

✔ Update `allow_origins`.

---

# 📄 10. Updating Dependencies

```bash
pip freeze > requirements.txt
```

---

# 🏁 Backend Ready

Your backend API is now fully configured for **local development**, testing, and frontend integration.
