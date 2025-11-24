# CAP5610 – Machine Learning (Course Project)
Longho Bernard Che ([lo476158@ucf.edu](mailto:lo476158@ucf.edu))

## 📘 AI Research Assistant
Your assistant to quickly grasp summaries of research papers simply by uploading their pdfs


This project is inspired by 
>"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" Authors: Jason Wei,
Xuezhi Wang, et al. (Google Research) Year: 2022 (NeurIPS) arXiv: https://arxiv.org/abs/2201.11903


### *Local Deployment Guide (Developer Setup)*



---

# 🚀 Overview

This application summarizes research papers using:

* **Baseline summarization**
* **Chain-of-Thought (CoT) summarization**

It includes:

* React (Vite) frontend
* FastAPI backend
* PDF parsing via PyMuPDF
* OpenAI-compatible model (e.g., Groq, Together, OpenAI, etc.)

---

# 📂 Project Structure

```
ai-research-assistant/
│
├── backend/
│   ├── main.py
│   ├── pdf_utils.py
│   ├── llm.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

# 🛠️ 1. Prerequisites

Make sure you have:

* **Python 3.9+**
* **Node.js 16+**
* **pip**
* **npm**
* **Virtual environment tools (venv)**

---

# 🧰 2. Backend Setup (FastAPI)

### 2.1 Create a virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
```

### 2.2 Install backend dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` missing:

```bash
pip install fastapi "uvicorn[standard]" PyMuPDF python-dotenv python-multipart openai
```

### 2.3 Fix PDF parsing errors (IMPORTANT)

```bash
pip uninstall fitz -y
pip install PyMuPDF
```

### 2.4 Create backend `.env` file

Create `backend/.env`:

```
OPENAI_API_KEY=YOUR_KEY
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=openai/gpt-oss-120b
```

### 2.5 Start FastAPI server

```bash
uvicorn main:app --reload --port 8000
```

Backend will run at:

```
http://localhost:8000
```

Check Swagger docs:

```
http://localhost:8000/docs
```

---

# 🎨 3. Frontend Setup (React + Vite)

### 3.1 Install frontend dependencies

```bash
cd frontend
npm install
```

### 3.2 Update backend URL

Inside `frontend/src/api.js` or equivalent:

```js
export const API_BASE = "http://localhost:8000";
```

### 3.3 Start the frontend

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔗 4. Configure CORS (IMPORTANT)

Ensure your backend allows the frontend origin.

In `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

# 🧪 5. Testing the Full Application Locally

### 1️⃣ Start backend:

```
uvicorn main:app --reload --port 8000
```

### 2️⃣ Start frontend:

```
npm run dev
```

### 3️⃣ Open UI:

```
http://localhost:5173
```

### 4️⃣ Upload PDF → Parse → Generate Baseline & CoT Summaries

---

# 🛠️ 6. Common Issues & Fixes

### ❌ **"fitz has no attribute open"**

✔ Fix:

```bash
pip uninstall fitz -y
pip install PyMuPDF
```

---

### ❌ **"CORS policy blocked request"**

✔ Fix: Add frontend origin to `allow_origins`.

---

### ❌ **"import openai could not be resolved"**

✔ Fix:

Use new syntax:

```python
from openai import OpenAI
client = OpenAI(...)
```

---

### ❌ **Model not found**

✔ Update `.env` with a supported model.

---

### ❌ **Frontend cannot reach backend**

Check:

* API_BASE URL
* Backend is running
* CORS settings

---

# 🎯 7. Environment Reset

If something breaks:

```bash
rm -rf venv
python -m venv venv
pip install -r requirements.txt
```

For frontend:

```bash
rm -rf node_modules
npm install
```

---

# 🎉 8. Local Deployment Complete

You now have the full system running on:

* **Backend:** [http://localhost:8000](http://localhost:8000)
* **Frontend:** [http://localhost:5173](http://localhost:5173)

