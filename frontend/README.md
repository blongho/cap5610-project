# 📘 Frontend — AI Research Assistant

React (Vite) + Bootstrap UI
Author: **Longho Bernard Che ([lo476158@ucf.edu](mailto:lo476158@ucf.edu))**
Course: **CAP5610 – Machine Learning**

---

## 🚀 Overview

This is the **frontend interface** of the AI Research Assistant.
It allows users to:

* Upload PDF research papers
* View extracted text
* Select paper sections
* Generate Baseline and Chain-of-Thought (CoT) summaries
* Compare summaries side-by-side

This frontend communicates with a [**FastAPI backend**](./../backend/) running at:

```
http://localhost:8000
```

---

# Requirements

* Node.js 16+
* npm 8+
* Backend running locally

---

# Install Dependencies

From the `frontend/` directory:

```bash
npm install
```

Also install Bootstrap:

```bash
npm install bootstrap
```

And import Bootstrap in `main.jsx`:

```js
import 'bootstrap/dist/css/bootstrap.min.css';
```

---

# Development Environment

### Update the Backend API URL

In `src/api.js`:

```js
export const API_BASE = "http://localhost:8000";
```

---

# Run the Development Server

```bash
npm run dev --expose 
# the --expose gives you an url such that you can test the application on another device on the same network e.g on your computer or phone connected to the same wifi
```

The app will be available at:

```
http://localhost:5173
```

---

# Communicating With the Backend

The frontend makes requests to:

* `POST /upload-pdf`
* `POST /summarize`

Make sure the backend is running before testing.

---

# UI Design Notes

The interface uses:

* **Bootstrap 5 components**
* **Responsive grid layout**
* **Centered container with maxWidth: 90%**
* Cards, alerts, buttons, and preview sections

---

# 🧪 Troubleshooting

### ❌ "Network Error"

✔ Backend not running → Start FastAPI.

### ❌ CORS errors

✔ Ensure backend allows:
`http://localhost:5173`

### ❌ Summaries not generating

✔ Check `.env` and model configuration in backend.

---

# 📄 8. Production Build

```bash
npm run build
```

Output files generated in:

```
dist/
```

