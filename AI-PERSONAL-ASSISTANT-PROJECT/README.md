# 🤖 AI Personal Assistant

A full-stack AI chatbot with a premium dark-mode UI, powered by Google Gemini.

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Python FastAPI |
| Database | SQLite (via SQLAlchemy) |
| AI | Google Gemini 2.0 Flash |

---

## 📁 Project Structure

```
AI-PERSONAL-ASSISTANT/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx      # Main chat interface
│   │   │   ├── Message.jsx    # Message bubble + markdown
│   │   │   └── Sidebar.jsx   # Conversation list
│   │   ├── hooks/
│   │   │   └── useChat.js    # Chat state management
│   │   ├── services/
│   │   │   └── api.js        # API client (Axios)
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Python FastAPI
│   ├── main.py               # App, routes, models — all-in-one
│   ├── services/
│   │   └── ai_service.py     # Gemini API integration
│   ├── requirements.txt
│   ├── .env                  # Your API key (git-ignored)
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **Python** 3.10+ — [Download](https://www.python.org/)
- **Gemini API Key** (free) — [Get one here](https://aistudio.google.com/apikey)

---

### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Add your Gemini API key
# Edit backend/.env and replace "your_api_key_here" with your actual key:
# GEMINI_API_KEY=AIzaSy...your_key_here

# Start the server
uvicorn main:app --reload --port 8000
```

The backend will run at **http://localhost:8000**.  
Interactive API docs at **http://localhost:8000/docs**.

---

### 2️⃣ Frontend Setup

```bash
# Open a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend will run at **http://localhost:5173**.

---

### 3️⃣ Use the App

1. Open **http://localhost:5173** in your browser
2. Click **"New Chat"** or just type a message
3. The AI will respond using Google Gemini
4. Your chat history is saved automatically in SQLite

---

## ✨ Features (Version 1)

- ✅ Modern dark-mode chatbot UI with glassmorphism design
- ✅ Send messages and receive AI-powered responses
- ✅ Conversation sidebar with create/delete
- ✅ Persistent chat history (SQLite)
- ✅ Markdown rendering in AI responses
- ✅ Typing indicator animation
- ✅ Responsive design (mobile-friendly)
- ✅ Quick-start suggestion chips
- ✅ Works without API key (graceful fallback messages)

---

## 🔑 API Endpoints

| Method   | Endpoint                         | Description             |
|----------|----------------------------------|-------------------------|
| `GET`    | `/api/health`                    | Health check            |
| `POST`   | `/api/chat`                      | Send message, get reply |
| `GET`    | `/api/conversations`             | List all conversations  |
| `POST`   | `/api/conversations`             | Create new conversation |
| `GET`    | `/api/conversations/{id}`        | Get conversation detail |
| `DELETE` | `/api/conversations/{id}`        | Delete a conversation   |

---

## 🛣️ Roadmap (Future Versions)

- [ ] Voice input/output
- [ ] PDF document analysis
- [ ] Smart reminders
- [ ] Task automation
- [ ] Multi-model support
