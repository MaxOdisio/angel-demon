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
npm install
npm run dev
```

Open `http://localhost:5173`, enter your OpenAI API key, and start submitting dilemmas.

### Production Build

```bash
npm run build
npm run preview
```

---

## Architecture & Design Choices

### Stack
- **React 18 + Vite** — fast DX, no backend needed for a prototype
- **Tailwind CSS** — utility-first, keeps components self-contained
- **OpenAI gpt-4o** — called directly from the browser; no server intermediary
- **localStorage** — conversation history + alignment score persist across sessions

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
User submits dilemma
    ↓
[1] Crowley responds (cold, no opponent context)
    ↓
[2] Sunny responds (aware of Crowley's argument, must counter)
    ↓
[3] Cosmic Judge evaluates both responses → JSON verdict
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

## Production Plan

### Phase 1 — Minimal viable production (1 week)
- Move API key to server-side (never expose it in the browser)
- Add a thin Express/FastAPI backend as a proxy
- Deploy to Vercel (frontend) + Railway (backend)
- Rate limiting per IP to prevent abuse

### Phase 2 — Persistence & multiplayer (2-3 weeks)
- Replace localStorage with a real DB (PostgreSQL via Supabase)
- User accounts (anonymous auth via Clerk)
- Global leaderboard: who has the most damned/blessed souls across all users
- Promotion board shows aggregate stats across all players

### Phase 3 — Engagement & monetization hooks
- "Share your dilemma" — generate shareable cards showing alignment
- Daily dilemma: one curated dilemma per day, competitive ranking
- Streak system: consecutive days of staying in Heaven/Hell
- Premium tier: longer memory, more debate rounds, custom dilemmas

---

## Challenges

### Solved
**JSON parsing from judge model** — GPT-4o sometimes wraps JSON in markdown fences. Fixed with a `.replace(/```json|```/g, '')` cleanup before `JSON.parse`.

**Debate feel** — Initial prompts had both characters respond independently, which felt disconnected. Fixed by feeding Crowley's response to Sunny, making Sunny actively counter-argue.

**Alignment drift** — Early scoring was too volatile (±30 per round). Capped at ±20 and added judge temperature=0.3 for more consistent scoring.

### Unsolved / Known Limitations
**No streaming** — Responses appear all at once. Adding SSE streaming would dramatically improve perceived performance and feel.

**Browser-exposed API key** — Fine for a prototype demo but unacceptable for production. Needs a backend proxy.

**Context length** — Currently only last 3 rounds are injected. For very long sessions, characters may lose early context. A summarization step (compress old rounds) would help.

**No user input between rounds** — The user currently just submits dilemmas; there's no free-form response that the characters react to. Adding a "user speaks" turn would increase immersion.

---

## Project Structure

```
src/
├── components/
│   ├── ApiKeySetup.jsx      # API key entry screen
│   ├── CharacterCard.jsx    # Sunny / Crowley response bubbles
│   ├── AlignmentBar.jsx     # Soul alignment meter
│   ├── PromotionBoard.jsx   # Competition scoreboard
│   ├── DilemmaInput.jsx     # Text input + random dilemma
│   ├── JudgementCard.jsx    # Round verdict display
│   └── HistoryPanel.jsx     # Expandable round history
├── constants/
│   └── characters.js        # Prompts, config, labels
├── hooks/
│   └── useGameState.js      # All game logic + localStorage
└── utils/
    └── openai.js            # API calls + context builder
```
