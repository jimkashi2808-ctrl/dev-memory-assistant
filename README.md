# 🍋 Lemon — Give Your AI a Memory

> **WeMakeDevs x Cognee Hackathon Submission**
> *"GitHub tells you what changed. ChatGPT tells you what you said. Lemon tells you WHY you built it — and remembers it forever."*

---

## 🎯 The Problem

Every developer loses context. You fix a bug on Monday, forget why you made that decision by Friday. You switch projects, come back a week later, and spend 2 hours re-understanding your own code. GitHub shows commit history — not reasoning. AI chats disappear. Notes get lost.

**Lemon solves this.** It gives your projects a persistent, searchable memory — powered by Cognee's knowledge graph.

---

## 💡 What Lemon Does

- **Log Sessions** — Describe what you worked on, which bugs you fixed, which AI prompts you used
- **Ask Your Memory** — Ask natural language questions like "What bug did I fix in auth.js?" and get real answers from your past sessions
- **GitHub Integration** — Paste any GitHub repo URL to instantly see real repo stats layered with your project memory
- **Analytics Dashboard** — Real charts showing your session frequency, bug categories, decision outcomes, and AI prompt usage
- **Bug Tracker** — Auto-detects bug sessions, classifies by severity, shows activity heatmap
- **Project Logs** — Full sortable history of everything you've worked on
- **Persistent Memory** — Sessions survive server restarts, stored locally as JSON

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Node.js + Express.js |
| Memory Engine | Cognee 1.2.2 (Python + FastAPI) |
| AI/LLM | Ollama (llama3.2) — 100% free, local |
| Embeddings | Ollama (nomic-embed-text) — 100% free, local |
| Charts | Chart.js |
| GitHub Data | GitHub REST API v3 |
| Storage | JSON file persistence |

---

## 🏗️ Architecture

```
Browser (localhost:3000)
    ↓
Node.js Express Server (port 3000)
    ↓
Python FastAPI + Cognee Server (port 8000)
    ↓
Ollama Local AI (port 11434)
    ↓
session_logs.json (persistent storage)
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- Ollama installed (ollama.com/download)

### Step 1 — Clone the repo
```bash
git clone https://github.com/jimkashi2808-ctrl/dev-memory-assistant
cd dev-memory-assistant
```

### Step 2 — Install Node dependencies
```bash
npm install
```

### Step 3 — Install Python dependencies
```bash
cd cognee-server
pip install fastapi uvicorn cognee python-dotenv
cd ..
```

### Step 4 — Pull Ollama models
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### Step 5 — Start both servers

**Terminal 1 — Cognee Server:**
```bash
cd cognee-server
python main.py
```

**Terminal 2 — Node.js Server:**
```bash
node server.js
```

### Step 6 — Open the app
Visit **http://localhost:3000**

---

## 📱 Pages

| Page | Description |
|------|-------------|
| `/` — Overview | Hero section, GitHub URL analyzer, Log Session panel, Project timeline |
| `/analytics.html` | Real charts — sessions per project, AI prompts, decision categories, outcome rates |
| `/logs.html` | Full sortable table of all logged sessions |
| `/bugs.html` | Bug tracker with heatmap, severity classification, category donut chart |

---

## ✨ Key Features

### 🧠 Cognee Knowledge Graph Memory
Unlike plain text storage, Cognee builds relationships between your sessions — connecting bugs to files, decisions to projects, and prompts to outcomes.

### 🔍 Smart Recall
Ask natural language questions. The recall engine scores sessions by relevance — exact phrase matches, keyword matches, context clues (bug sessions, prompt sessions, file references) all contribute to finding the right answer.

### 📊 Real Analytics — Zero Fake Data
Every chart pulls from your actual logged sessions. The category donut detects Engineering vs Security vs Performance vs Design decisions from your session text automatically.

### 🐙 GitHub Native
Paste any public GitHub URL — Lemon fetches real stars, description, forks, and last push date from the GitHub API instantly.

### 💰 100% Free
Runs entirely on Ollama local models. No OpenAI API key. No billing. No rate limits. No data leaves your machine.

---

## 🎨 Design & Inspiration

The design concept — dark dashboard with gold accent colors, animated hero section, floating memory cards — was my original idea. I sketched the layout in Figma first, then built it.

For the cosmic/space background animations in the hero and bugs page, I came up with the visual concept (glitter particles, orbital glow effects) and implemented it through iterative experimentation.

---

## 🤖 AI Tools Used During Development

I want to be fully transparent about how I built this project:

| Tool | How I Used It |
|------|--------------|
| **Claude AI** | Primary coding assistant — helped me write Python (a language I didn't know before this hackathon), debug the Cognee integration, fix server errors, and structure the backend architecture |
| **ChatGPT** | Used for some frontend ideas and general problem-solving when stuck |
| **Gemini** | Helped with frontend layout ideas for specific sections |

**What was entirely mine:**
- The core project idea — developer memory loss as a problem worth solving
- The product concept — "GitHub remembers code, Lemon remembers reasoning"
- The design decisions — dark gold theme, dashboard layout, page structure, hero section concept
- The feature set — which pages to build, what data to show, how the log/recall flow works
- The tech stack decisions — choosing Ollama for free local AI, Cognee for the knowledge graph
- The pitch framing — "Give your AI a memory"

I used AI tools as a learning accelerator. I'm not a Python developer, but I understood every line of code that went into this project and made all the architectural decisions myself.

---

## 🏆 Hackathon Criteria

| Criterion | How Lemon Addresses It |
|-----------|----------------------|
| **Potential Impact** | Every developer loses context — this solves a universal problem |
| **Creativity & Innovation** | First tool to combine developer session logging with Cognee's knowledge graph |
| **Technical Excellence** | Full-stack app with persistent memory, real-time GitHub integration, smart recall scoring |
| **Best Use of Cognee** | Cognee is the core memory engine — add/cognify/search used for knowledge graph building |
| **User Experience** | Animated hero, dark dashboard, real-time charts, intuitive log/recall flow |
| **Presentation** | Clear README, working demo, real data throughout |

---

## 📸 Screenshots

> Overview Dashboard with GitHub URL analysis
> Analytics page with real session data
> Bug tracker with activity heatmap
> Ask Lemon AI modal with memory recall

---

## 👤 Built By

**Kashish** — Solo participant
- GitHub: [@jimkashi2808-ctrl](https://github.com/jimkashi2808-ctrl)
- Project: [dev-memory-assistant](https://github.com/jimkashi2808-ctrl/dev-memory-assistant)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ and a lot of lost context for the WeMakeDevs x Cognee Hackathon 2026*
