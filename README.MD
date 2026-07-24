---
portfolio: true
title: Real-Time Market Data Dashboard
tagline: Live market data streaming with paper trading simulator
stack: [Next.js, TypeScript, WebSocket, Supabase, Tailwind, Zustand]
featured: true
---

# Real-Time Market Data Dashboard — Project Plan

**Goal:** Build one portfolio-defining project that proves full-stack + real-time systems capability, aligned with your Precize experience, in ~8-10 weeks of Wed/Thu sessions.
 
---

## 1. Project Definition

**Working name:** Real-Time Market Data Dashboard (Paper Trading)

**One-line pitch (for resume/interviews):**
"A live market dashboard with WebSocket price streaming, watchlists, alerts, and a paper-trading simulator with real-time P&L tracking."

**Who it's for:** Retail users who want to track live prices, build watchlists, and practice trading strategies without risking real money.

---

## 2. Core Features (build in this order — each is a complete milestone)

### Tier 1 — Must have (this is what makes it "real")
1. **Live price streaming** — WebSocket connection to a free market data feed, showing real-time price ticks for a set of symbols (stocks or crypto).
2. **Auth** — Email/password or Google OAuth (you already have NextAuth experience from The Wild Oasis — reuse that).
3. **Watchlist** — Users add/remove symbols, persisted per-user in Postgres, live-updating prices.
4. **Live chart** — At least one symbol detail view with a real-time updating candlestick/line chart.

### Tier 2 — What makes it impressive
5. **Paper trading simulator** — Fake starting balance (e.g., ₹1,00,000), buy/sell orders at live price, running portfolio with unrealized P&L.
6. **Price alerts** — User sets a target price, gets a toast/notification (or email via a cron job) when hit.
7. **Order history / trade log** — Table of past trades with timestamps, entry/exit price, P&L per trade.

### Tier 3 — Polish (only if time allows, don't block on these)
8. Dark mode / TradingView-style theme (fits the domain, easy visual win).
9. Multiple watchlists / portfolios per user.
10. Basic technical indicators (moving average line on chart) — nice talking point for "I understand the domain," not required.

**Cut ruthlessly if you're behind schedule: Tiers 2–3 are what separates "good" from "great," but Tier 1 alone is already a legitimate, resume-worthy project. Never let scope creep delay shipping.**

---

## 3. Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│   Next.js App    │◄───────►│   Postgres DB     │
│  (Frontend + API │         │  (Supabase)       │
│   routes)         │         │  - users          │
│                    │         │  - watchlists     │
│  - Zustand store   │         │  - trades         │
│    (live prices)   │         │  - alerts         │
└────────┬───────────┘         └──────────────────┘
         │
         │ WebSocket
         ▼
┌──────────────────┐
│ Market Data Feed  │
│ (Binance WS /     │
│  Finnhub WS)       │
└──────────────────┘
```

**Key architectural decision to think through (and be ready to explain in interviews):**
Where does the WebSocket connection live? Two options:
- **Client-side connection**: Browser connects directly to the market data WebSocket. Simple, but every open tab makes its own connection, and you can't easily persist/replay data.
- **Server-side relay**: Your Node backend maintains one WebSocket connection to the market feed, then broadcasts to connected clients via Socket.io or Supabase Realtime. More scalable, more "real" architecture.

**Recommendation: start client-side (Tier 1, get it working fast), then refactor to server-side relay as a Tier 2 stretch goal.** That refactor itself is a great "here's how I improved the architecture" story for interviews.

---

## 4. Tech Stack (all free-tier friendly)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + TypeScript | Already your strength, keep it |
| Styling | Tailwind CSS | Fast, matches your existing skills |
| State (live prices) | Zustand | You already used this at Precize — reuse the pattern |
| Charts | `lightweight-charts` (TradingView's free open-source library) | Looks polished out of the box, industry-standard |
| Auth | NextAuth.js | You already built this in The Wild Oasis |
| Database | Supabase (Postgres) | Free tier, plus built-in Realtime if you do the server-relay refactor |
| Market data | Binance public WebSocket (crypto, no API key needed) OR Finnhub (stocks, free tier with key) | Binance is easiest to start with — zero auth friction |
| Deployment | Vercel (frontend) + Supabase (DB) | Free, matches your existing Vercel experience |

**Data feed recommendation: start with Binance's public WebSocket for crypto.** No API key, no rate limits to worry about early on, and genuinely real-time. You can add a stock feed (Finnhub) later as a stretch.

---

## 5. Week-by-Week Plan (Wed/Thu sessions, ~2 sessions/week)

| Week | Milestone |
|---|---|
| 1 | Project setup: Next.js + TS + Tailwind scaffolded, deployed empty shell to Vercel. Supabase project created, schema designed (users, watchlists, trades, alerts tables). |
| 2 | Auth working end-to-end (NextAuth + Supabase). Basic layout: navbar, empty dashboard page. |
| 3 | Connect to Binance WebSocket, get live prices flowing into a Zustand store, display raw ticking prices for 3-5 symbols on screen (ugly is fine). |
| 4 | Build the watchlist: add/remove symbols, persist to Postgres, prices update live for saved symbols. |
| 5 | Live chart page: pick a symbol, show `lightweight-charts` candlestick chart updating in real time. |
| 6 | Paper trading: buy/sell UI, balance tracking, portfolio view with live unrealized P&L calculated against current prices. |
| 7 | Trade history table + price alerts (toast notification when target hit). |
| 8 | Polish pass: loading states, error handling (what happens when WebSocket drops?), responsive design, empty states. Write the README. |
| 9 (buffer) | Stretch: server-side WebSocket relay refactor, OR second data source, OR dark theme polish. |
| 10 | Final deploy, record a 60-90 second demo video/GIF for your portfolio, write the case study writeup (see section 6). |

**If you fall behind:** it's fine to skip Week 9 entirely and Week 10 alerts/history — Tier 1 + basic paper trading (through Week 6) is already a strong, complete, demo-able project. Don't let perfectionism kill momentum.

---

## 6. What to Prepare Alongside the Code (this is what makes it interview-ready, not just "done")

1. **A short case-study writeup** (README or portfolio page): what it does, why you built it, the architecture decision (client vs server WebSocket) and why, one real technical challenge you hit and how you solved it.
2. **A live deployed link** — not just GitHub. Recruiters rarely clone repos; they click links.
3. **A 60-90 second screen-recording demo** (Loom or similar) — embed it in your portfolio/README. Massively increases the chance anyone actually sees it work.
4. **One well-rehearsed story about a real bug or design decision** — e.g., "handling WebSocket reconnection when the connection drops" or "why I chose to store P&L calculations server-side vs client-side."

---

## 7. How This Slots Into Your Resume

Once built, this replaces "The Wild Oasis" (the recognizable tutorial project) in your projects section:

> **Real-Time Market Dashboard | Next.js, TypeScript, WebSockets, Supabase, Zustand** — Live Demo
> - Built real-time market data dashboard streaming live prices via WebSocket, with live-updating charts and watchlists persisted per user.
> - Implemented paper-trading simulator with live P&L calculation against real-time price feeds.
> - Designed [client-side / server-relay] WebSocket architecture to [handle X concurrent connections / avoid redundant connections per client].

Fill in the bracketed part once you've actually made that architectural decision — specific numbers/reasoning here matter more than the buzzwords.
