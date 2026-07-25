---
portfolio: true
title: Real-Time Market Data Dashboard
tagline: Live market data streaming with paper trading simulator
stack: [Next.js, TypeScript, WebSocket, Supabase, Tailwind, Zustand]
featured: true
---

# 📊 Real-Time Market Data Dashboard

> A live market dashboard with WebSocket price streaming, watchlists, alerts, and a paper-trading simulator with real-time P&L tracking.

[![Built with Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**Status:** 🚀 In Development | **Live Demo:** [Coming Soon](#) | **API Docs:** [View Docs](#)

---

## 🎯 Overview

A full-stack real-time market dashboard built with modern web technologies. Track live market prices, build custom watchlists, set price alerts, and practice trading strategies with a paper-trading simulator—all without risking real money.

**Perfect for:**
- 📈 Retail traders learning market dynamics
- 💡 Developers learning real-time data streaming
- 🎓 Students practicing financial algorithms
- 🧪 Anyone wanting to backtest trading strategies

---

## ✨ Features

### Core Functionality

- **⚡ Live Price Streaming** — Real-time price updates via WebSocket connection to market data feeds
- **📊 Interactive Charts** — Real-time candlestick and line charts with TradingView's industry-standard library
- **⭐ Watchlists** — Create and manage custom watchlists with live price updates
- **🔔 Price Alerts** — Set target prices and receive instant notifications when levels are hit
- **🎮 Paper Trading** — Full-featured simulator with virtual capital for practicing trades
- **📈 Portfolio Tracking** — Real-time P&L calculations and portfolio performance monitoring
- **📝 Trade History** — Complete trade log with entry/exit prices, timestamps, and per-trade analytics
- **🔐 User Authentication** — Secure email/password and OAuth login

### Tech-Forward Features

- **Real-time WebSocket architecture** for sub-second data delivery
- **Responsive design** that works seamlessly on desktop, tablet, and mobile
- **Dark mode** with polished TradingView-inspired theme
- **Type-safe** development with full TypeScript coverage
- **Optimized state management** with Zustand for minimal re-renders

---

## 🏗️ Architecture

```
┌──────────────────────────┐         ┌─────────────────────┐
│      Next.js App          │◄───────►│   Postgres Database  │
│   (Frontend + API)        │         │    (Supabase)        │
│                            │         │  • users             │
│  • React Components        │         │  • watchlists        │
│  • Zustand Store          │         │  • trades            │
│  • Tailwind Styles        │         │  • alerts            │
└────────────┬───────────────┘         └─────────────────────┘
             │
             │ WebSocket
             ▼
    ┌────────────────────┐
    │  Market Data Feed   │
    │  • Binance API      │
    │  • Finnhub API      │
    └────────────────────┘
```

### Architecture Highlights

**WebSocket-Powered Real-Time Updates**
- Direct client-side connections to market data feeds for instant price updates
- Efficient state management ensures minimal bandwidth usage
- Automatic reconnection handling for robust connections

**Scalable Backend**
- RESTful API routes for user operations and portfolio management
- Real-time database subscriptions via Supabase
- Optimized queries for responsive performance

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 13+ | React framework with server-side rendering |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State** | Zustand | Lightweight state management |
| **Charts** | lightweight-charts | Professional charting library |
| **Real-time** | WebSocket | Live data streaming |
| **Auth** | NextAuth.js | Secure authentication |
| **Database** | Supabase (PostgreSQL) | Cloud database with Realtime |
| **Market Data** | Binance / Finnhub API | Real market data feeds |
| **Deployment** | Vercel / Supabase | Serverless hosting |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account
- Market data API key (optional for Finnhub)

### Installation

```bash
# Clone the repository
git clone https://github.com/JangoSaga/market-dashboard.git
cd market-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your configuration
# - Supabase project URL and key
# - NextAuth secret
# - Market data API keys (optional)
```

### Environment Setup

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Market Data (Optional)
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Project Structure

```
market-dashboard/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Main dashboard pages
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── charts/              # Chart components
│   ├── watchlist/           # Watchlist UI
│   └── trading/             # Trading interface
├── lib/                     # Utilities and helpers
│   ├── api/                 # API client functions
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript types
├── styles/                  # Global styles
└── public/                  # Static assets
```

---

## 📱 Features Deep Dive

### Live Price Streaming

Real-time price updates delivered via WebSocket. Price data flows directly into your Zustand store for instant UI updates.

```typescript
// Example: Subscribe to price updates
const { prices, subscribe } = usePriceStore();

useEffect(() => {
  subscribe(['BTC/USD', 'ETH/USD']);
}, []);
```

### Paper Trading Simulator

Practice trading with virtual capital. Full order management including:
- Market and limit orders
- Position tracking with live P&L
- Trade history and performance analytics
- Risk management tools

### Watchlist Management

Organize and track your favorite assets:
- Create multiple watchlists
- Add/remove symbols instantly
- Sort by price, change, or custom criteria
- Export watchlist data

### Price Alerts

Set up custom alerts for any asset:
- Get notified when price reaches your target
- Multiple alert types (above, below, equals)
- Toast notifications and optional email alerts
- Persistent alert history

---

## 🔌 API Reference

### Authentication Endpoints

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `GET /api/auth/session` — Get current session

### Watchlist Endpoints

- `GET /api/watchlist` — Fetch user's watchlists
- `POST /api/watchlist` — Create new watchlist
- `PUT /api/watchlist/:id` — Update watchlist
- `DELETE /api/watchlist/:id` — Delete watchlist

### Trading Endpoints

- `GET /api/portfolio` — Get portfolio data
- `POST /api/trade` — Execute trade
- `GET /api/trades` — Get trade history
- `GET /api/alerts` — Get price alerts

---

## 🎨 UI Preview

- **Dashboard** — Overview of all watchlists and portfolio summary
- **Symbol Detail** — In-depth chart view with trading interface
- **Portfolio** — Complete position tracking and P&L analysis
- **Trade History** — Detailed log of all trades with filters
- **Alerts** — Manage and view alert history

---

## 🛠️ Development

### Running Tests

```bash
npm run test
```

### Code Quality

```bash
npm run lint
npm run format
```

### Building for Production

```bash
npm run build
npm start
```

---

## 🚢 Deployment

### Deploy on Vercel

Vercel is the recommended platform for deployment:

```bash
npm install -g vercel
vercel
```

### Deploy Database

Supabase is used for the database. Set up a Supabase project and migrate the schema:

```bash
npm run migrate
```

---

## 📚 Documentation

- **[Database Schema](./docs/SCHEMA.md)** — Data model and relationships
- **[API Documentation](./docs/API.md)** — Complete API reference
- **[Architecture Guide](./docs/ARCHITECTURE.md)** — System design and decisions
- **[Contributing Guide](./CONTRIBUTING.md)** — How to contribute

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guide](https://supabase.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [lightweight-charts](https://tradingview.github.io/lightweight-charts/)
- [Binance WebSocket API](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)
- [Finnhub API](https://finnhub.io/docs/api)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

---

## 💬 Support

Have questions or found an issue? 

- 📧 Email: support@example.com
- 🐛 [Open an issue](https://github.com/JangoSaga/market-dashboard/issues)
- 💬 [Start a discussion](https://github.com/JangoSaga/market-dashboard/discussions)

---

**Built with ❤️ by the market-dashboard team**

**Last Updated:** July 25, 2026
