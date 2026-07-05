# 🍋 Lemon — Give Your AI a Memory

> **WeMakeDevs x Cognee Hackathon Submission | July 2026**
> *"GitHub tells you what changed. ChatGPT tells you what you said. Lemon tells you WHY you built it — and remembers it forever."*

---

## 🎯 The Problem

Every developer loses context. You fix a bug on Monday, forget why you made that decision by Friday. You switch projects, come back a week later, and spend 2 hours re-understanding your own code.

- GitHub shows commit history — not reasoning
- AI chats disappear after the session ends
- Notes get scattered and lost
- No tool connects bugs → decisions → AI prompts → files together

**Lemon solves this.** It gives your projects a persistent, searchable memory powered by Cognee's knowledge graph.

---

## 💡 What Lemon Does

- **🧠 Log Sessions** — Describe what you worked on, bugs fixed, AI prompts used
- **🔍 Ask Your Memory** — Ask "What bug did I fix in auth.js?" and get real answers
- **🐙 GitHub Integration** — Paste any GitHub URL to see real repo data + memory layer
- **📊 Real Analytics** — Session frequency, bug categories, decision outcomes, AI prompt usage
- **🐛 Bug Tracker** — Auto-detects bugs, classifies severity, shows activity heatmap
- **📋 Project Logs** — Full sortable history of everything you've worked on
- **💾 Persistent Memory** — Sessions survive server restarts via JSON file storage
- **🗑️ Delete Sessions** — Remove unwanted logs directly from the dashboard
- **🤖 Ask Lemon AI** — Chat interface to query your memory from any page

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML, CSS, Vanilla JS | Dashboard UI |
| Backend | Node.js + Express.js | API server (port 3000) |
| Memory Engine | Cognee 1.2.2 + FastAPI | Knowledge graph (port 8000) |
| Local AI | Ollama (llama3.2) | Free local LLM |
| Embeddings | Ollama (nomic-embed-text) | Free local embeddings |
| Charts | Chart.js | Analytics visualizations |
| GitHub Data | GitHub REST API v3 | Real repo data |
| Storage | JSON file persistence | Session logs survive restarts |

---

## 🏗️ Architecture

```
Browser (localhost:3000)
         ↓
Node.js Express Server (port 3000)
    ↙           ↘
GitHub API    Python FastAPI + Cognee (port 8000)
                      ↓
              Ollama Local AI (port 11434)
                      ↓
            session_logs.json (persistent)
```

---

## 📱 Pages Built

| Page | URL | What It Shows |
|------|-----|---------------|
| Overview | `/` | Hero, GitHub analyzer, Log Session, Timeline, Bugs list |
| Analytics | `/analytics.html` | Real charts — sessions, AI prompts, decisions, outcomes |
| Project Logs | `/logs.html` | Sortable table of all logged sessions |
| Bugs | `/bugs.html` | Bug tracker, severity matrix, heatmap, category donut |

---

## ✨ Key Features

### 🧠 Cognee Knowledge Graph
Cognee builds relationships between your sessions — connecting bugs to files, decisions to projects. Uses `cognee.add()` and `cognee.cognify()` to build the graph, `cognee.search()` with `SearchType.SUMMARIES` and `SearchType.CHUNKS` for intelligent recall.

### 🔍 Smart Recall with Fallback
Tries Cognee knowledge graph search first. If unavailable, falls back to a relevance-scored keyword search that scores sessions by exact phrase matches, keyword matches, bug/prompt context detection, and dataset matching.

### 📊 Real Analytics 
Every chart pulls from actual logged sessions. Categories auto-detected from session text (Security, Engineering, Performance, Design). Outcome rate calculated from keywords like "fixed", "resolved", "working on".

### 🐙 GitHub Native
Paste any public GitHub URL — fetches real stars, description, forks, last push date from GitHub REST API v3 instantly.

### 💰 100% Free to Run
Uses Ollama local models. No OpenAI billing. No rate limits. No data leaves your machine.

### ⚡ 8-Second Timeout Protection
Ask Lemon AI has built-in timeout — never gets permanently stuck on "Thinking".

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- Ollama (ollama.com/download)

### Step 1 — Clone
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

### Step 5 — Start servers

**Terminal 1 — Cognee:**
```bash
cd cognee-server
python main.py
```
Wait for: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 — Node:**
```bash
node server.js
```
Wait for: `Dev Memory Assistant running on http://localhost:3000`

### Step 6 — Open
Visit **http://localhost:3000**

---

## 🎨 Design

The entire visual design — dark dashboard with gold accent colors, animated hero section with cosmic particle effects, floating memory cards, the Figma-inspired layout — was my original concept. I sketched the layout and decided what goes where before writing any code.

---

## 🤖 AI Tools Used During Development

Full transparency on how I built this:

| Tool | Role |
|------|------|
| **Claude AI** | Primary coding partner — helped write Python (new to me), debug Cognee integration, fix server errors, structure backend. Used throughout the entire build. |
| **ChatGPT** | Ideas for certain features and problem-solving when stuck |
| **Gemini** | Frontend layout ideas for specific UI sections |
| **Cognee** | The core memory engine powering the entire project |

### What was entirely mine:
- ✅ The core idea — developer memory loss as a hackathon problem worth solving
- ✅ The product concept — "GitHub remembers code, Lemon remembers reasoning"
- ✅ All design decisions — dark gold theme, page structure, which sections go where
- ✅ The full feature set — log/recall flow, GitHub integration, analytics, bug tracker
- ✅ Tech stack decisions — Ollama for free AI, Cognee for knowledge graph, Node+Python split
- ✅ The pitch framing — "Give your AI a memory"
- ✅ Every decision about what to build and why

I used AI as a learning accelerator. I'm not a Python developer — I learned it during this hackathon by building this project with Claude's help. I understood every architectural decision and made all product choices myself.

---

## 🏆 Hackathon Judging Criteria

| Criterion | Lemon's Approach |
|-----------|-----------------|
| **Potential Impact** | Universal developer problem — every dev loses context daily |
| **Creativity & Innovation** | First tool combining session logging + Cognee knowledge graph for individual developers |
| **Technical Excellence** | Full-stack: Node.js + Python + Cognee + Ollama + GitHub API + real-time charts |
| **Best Use of Cognee** | Core memory engine — `add()`, `cognify()`, `search()` with SUMMARIES + CHUNKS |
| **User Experience** | Animated hero, dark dashboard, real-time charts, intuitive log/recall/delete flow |
| **Presentation** | Full README, working demo, real data throughout, transparent AI tool usage |

---

## 👤 Built By

**Kashish** — Solo participant
- GitHub: [@jimkashi2808-ctrl](https://github.com/jimkashi2808-ctrl)
- Repo: [dev-memory-assistant](https://github.com/jimkashi2808-ctrl/dev-memory-assistant)

---

*Built with ❤️ for the WeMakeDevs x Cognee Hackathon 2026*
*"Never lose context again."*
