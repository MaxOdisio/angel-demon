# Angel vs Demon — The Promotion 😇😈

A conversational AI application where **Sunny** (Angel) and **Crowley** (Demon) compete for a promotion by arguing over your soul.

---

## Quick Start

### Prerequisites
- Node.js 18+
- An OpenAI API key

### Setup

```bash
git clone <repo>
cd angel-demon
cd frontend && npm install
cd ../backend && npm install
```

Create a `.env` file in the `backend/` directory:

```
OPENAI_API_KEY=sk-your_openai_api_key
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Running Server + Frontend

**Terminal 1 — Backend:**
```bash
cd angel-demon/backend
npm run dev
```

The server will be running on `http://localhost:3000`.

**Terminal 2 — Frontend:**
```bash
cd angel-demon/frontend
npm run dev
```

Open `http://localhost:5173` in your browser and start submitting dilemmas.

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm run build
npm run start
```

---

## Architecture & Design Choices

### Stack
- **Frontend:** React 18 + Vite + Tailwind CSS — fast DX, responsive UI
- **Backend:** Node.js/TypeScript + Express.js — secure, type-safe API proxy
- **LLM:** OpenAI gpt-4o — powerful multi-turn conversations
- **Storage:** localStorage (frontend) — conversation history + alignment persist across sessions
- **Security:** API key lives server-side only, never exposed to browser

### Design Pattern: API Proxy

The frontend **never talks to OpenAI directly**. Instead:
1. Frontend submits a dilemma to the backend (`POST /api/debate`)
2. Backend orchestrates the three OpenAI calls (Crowley → Sunny → Judge)
3. Backend returns structured JSON response to frontend

This approach:
- Protects the API key (never exposed to browser)
- Gives the backend control over rate limiting, error handling, and orchestration logic
- Simplifies frontend — no need to manage API keys or authentication

### AI Engineering

#### Character System Prompts
Each character has a carefully crafted system prompt that defines:
- Core personality traits and speech patterns
- Competitive awareness (they know about the promotion)
- Response format constraints (length, joke requirements, etc.)
- Strategic behavior (adapt based on history)

**Crowley goes first** in every round by design — demons are eager, and it forces Sunny to respond reactively, creating natural debate tension.

#### Debate Flow (per dilemma)
```
User submits dilemma from frontend
    ↓
Frontend calls backend: POST /api/debate
    ↓
Backend orchestrates three sequential OpenAI calls:
    ├─ [1] Crowley responds (cold, no opponent context)
    ├─ [2] Sunny responds (aware of Crowley's argument, must counter)
    └─ [3] Cosmic Judge evaluates both → JSON verdict
    ↓
Backend returns structured response to frontend
    ↓
UI updates: alignment score, promotion board, history
```

#### Memory & Adaptation
The last 3 conversation rounds are injected into each character's context window before every response. This means:
- Characters reference previous user choices
- They escalate or change tactics based on what's working
- The judge's `alignmentDelta` reflects cumulative user tendencies

#### Alignment Scoring
- Scale: `-100` (Hell) to `+100` (Heaven)
- Each round the judge returns an `alignmentDelta` between `-20` and `+20`
- The judge weighs: argument quality, dilemma type, user response pattern
- 9 labeled states from "Fully Condemned" to "Fully Sanctified"

#### Promotion Competition
- Each character accumulates "souls won" (rounds where they were judged the winner)
- Displayed as a live race on the Promotion Board
- Motivates the characters narratively — they reference their competition internally

---

## API Contract

### Endpoint

```
POST /api/debate
```

### Request

```json
{
  "dilemma": "string (1-400 chars)",
  "conversationHistory": [
    {
      "dilemma": "string",
      "sunny": "string",
      "crowley": "string",
      "judgement": {
        "roundWinner": "sunny" | "crowley" | "tie",
        "winnerReason": "string",
        "sunnyScore": "number (0-100)",
        "crowleyScore": "number (0-100)",
        "alignmentDelta": "number (-20 to +20)",
        "judgement": "string",
        "userLeaning": "heaven" | "hell" | "neutral"
      }
    }
  ],
  "currentAlignment": "number (-100 to +100)"
}
```

### Response (200 OK)

```json
{
  "sunny": "string",
  "crowley": "string",
  "judgement": {
    "roundWinner": "sunny" | "crowley" | "tie",
    "winnerReason": "string",
    "sunnyScore": "number (0-100)",
    "crowleyScore": "number (0-100)",
    "alignmentDelta": "number (-20 to +20)",
    "judgement": "string",
    "userLeaning": "heaven" | "hell" | "neutral"
  }
}
```

### Error Response (4xx/5xx)

```json
{
  "error": "error_type",
  "message": "Human-readable error message"
}
```

---

## Production Plan

### Phase 1 — Secure, validated backend (current)
- ✅ API key moved to server-side
- ✅ Input validation on the server
- ✅ Error handling and proper HTTP status codes
- ✅ CORS configured correctly
- TODO: Rate limiting per IP to prevent abuse

### Phase 2 — Persistence & multiplayer
- Replace localStorage with a real DB (PostgreSQL)
- Add user accounts (JWT authentication)
- Global leaderboard: who has the most damned/blessed souls across all users
- Promotion board shows aggregate stats across all players

### Phase 3 — Engagement & monetization hooks
- "Share your dilemma" — generate shareable cards showing alignment
- Daily dilemma: one curated dilemma per day, competitive ranking
- Streak system: consecutive days of staying in Heaven/Hell
- Premium tier: longer memory, more debate rounds, custom dilemmas

---

## Challenges

### Solved ✅
- **Removed API key from browser** — moved to backend environment variable, never exposed
- **Structured TypeScript backend** — proper separation of concerns (routes, handlers, services, types)
- **Input validation** — validates dilemma length, history structure, and alignment range server-side
- **CORS properly configured** — frontend and backend can communicate safely
- **Error handling** — distinguishes 4xx (client error) from 5xx (server error), provides meaningful messages
- **JSON parsing robustness** — Judge fallback to tie verdict if parsing fails, with logging

### Unsolved / Known Limitations 🚧
- **Streaming responses (SSE)** — Responses appear all at once. Server-sent events would improve perceived latency
- **Rate limiting** — No protection against request flooding yet. Need `express-rate-limit` middleware
- **Database & persistence** — Still using localStorage on frontend; no user accounts or cross-device sync
- **Authentication/Authorization** — No user login, anyone can call the API endpoints
- **Context length** — Currently only last 3 rounds injected. Long sessions might lose early context; summarization would help
- **No user response input** — User only submits dilemmas, not free-form rebuttals. A "user speaks" turn would increase immersion
- **Scaling** — Single backend instance. Would need load balancing and multiple instances for high traffic

---

## Project Structure

```
angel-demon/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CharacterCard.jsx    # Sunny / Crowley response bubbles
│   │   │   ├── AlignmentBar.jsx     # Soul alignment meter
│   │   │   ├── PromotionBoard.jsx   # Competition scoreboard
│   │   │   ├── DilemmaInput.jsx     # Text input + random dilemma
│   │   │   ├── JudgementCard.jsx    # Round verdict display
│   │   │   └── HistoryPanel.jsx     # Expandable round history
│   │   ├── constants/
│   │   │   └── characters.js        # System prompts, config, labels
│   │   ├── hooks/
│   │   │   └── useGameState.js      # Game logic + localStorage
│   │   └── utils/
│   │       ├── api.js               # Calls to backend /api/debate
│   │       └── validation.js        # Validates backend response structure
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── api/
    │   │   └── debate.ts            # Debate endpoint handler + input validation
    │   ├── constants/
    │   │   ├── characters.ts        # System prompts (Sunny, Crowley, Judge)
    │   │   └── env.ts               # Environment variables with validation
    │   ├── types/
    │   │   └── debate_types.ts      # TypeScript types for debate data
    │   ├── utils/
    │   │   └── openai.ts            # OpenAI API calls + context builder
    │   └── index.ts                 # Express server setup
    ├── package.json
    ├── tsconfig.json
    └── .env                         # Local environment (git-ignored)
```

---

## Getting Started for Developers

1. **First time setup:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Configure backend:**
   - Create `backend/.env` with your OpenAI API key
   - See `.env` section above for example

3. **Run both servers:**
   - Open two terminal windows
   - `cd backend && npm run dev` in one
   - `cd frontend && npm run dev` in the other

4. **Test the flow:**
   - Open `http://localhost:5173`
   - Submit a dilemma like: "You can save your best friend or 100 strangers. Who do you choose?"
   - Watch Crowley and Sunny debate, then the Judge decides

---
