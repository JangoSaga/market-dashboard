# LinkedIn Post — MarketPulse (learning-project framing)

> Fill the placeholders, then copy one of the post variants below.
> `[DEMO]` = your live Vercel link · `[REPO]` = your GitHub link · `[VIDEO]` = 60–90s screen recording

---

## Before you post (5-minute checklist)

1. **Make the deploy public** — Vercel → market-dashboard → Settings → Deployment Protection → Vercel Authentication → **Off**. Right now the link asks visitors to log in to Vercel; people will bounce.
2. **Make the GitHub repo public** — Settings → General → Danger Zone → Change visibility → Public. (`.env.local` is gitignored, so no secrets ship.)
3. **Record a 60–90s demo** (Loom / ScreenStudio): sign up → watchlist ticking → open a chart → place a paper trade → P&L updates → set an alert → toast fires. On LinkedIn, a **native video upload** gets far more reach than a link.
4. Test the sign-up flow from an incognito window.

---

## Option A — Concise (recommended)

I wanted to actually understand real-time systems, not just read about them. So I gave myself a project that couldn't work without them.

Meet **MarketPulse** — a crypto market dashboard with live prices, live charts, and a paper-trading simulator (virtual balance, real market data).

Going in, a lot of this was new to me. What I set out to learn, and did:

📡 **WebSockets** — streaming live prices for 27 pairs into one shared store, and handling the messy part: what happens when the connection drops. I learned to reconnect with exponential backoff so the UI heals itself instead of freezing.

💸 **Transactions and data integrity** — my first version of "buy/sell" had a race condition where a balance could go wrong under concurrent trades. Rewriting it as a single locked database transaction was the moment transactions finally clicked for me.

🔒 **Trusting the server, not the client** — I initially let the browser send the trade price. Then it hit me: a user could just send a fake price. Moving price-fetching to the server was a small change with a big lesson about where trust belongs.

🛡️ **Row-level security** — enforcing "users can only touch their own data" at the database layer instead of hoping the app code gets it right every time.

Stack I learned along the way: Next.js 16, TypeScript, Tailwind, Zustand, Supabase (Postgres + Auth + RLS), Binance WebSockets, Vercel.

Still a work in progress, and I'd genuinely love feedback from people who build this stuff for real.

Live demo 👉 [DEMO]
Code 👉 [REPO]

#LearningInPublic #WebDevelopment #NextJS #TypeScript #Supabase #WebSockets #FullStack

---

## Option B — Technical (for a developer audience)

I've been leveling up on real-time and backend correctness, so I built a project that would force me to learn both properly: **MarketPulse**, a live market dashboard with a paper-trading simulator.

🔗 Live: [DEMO]  ·  💻 Code: [REPO]

Four things I understand a lot better now than when I started:

1) **Where trust belongs.** My first buy/sell let the client send the execution price. Then I realized a user could forge it. Now the client sends only symbol, side, and quantity; the server fetches the live price at execution time. Small change, big mental model shift.

2) **What a transaction is actually for.** Moving cash and recording a trade are two writes that must both happen or neither. Under concurrent trades my naive version could corrupt a balance. Wrapping it in a Postgres function that locks the balance row (SELECT ... FOR UPDATE) and commits atomically was the moment "ACID" stopped being a buzzword for me.

3) **Designing for failure, not the happy path.** A WebSocket that works in the demo but freezes when the network blips isn't done. Learning to detect the drop and reconnect with backoff changed how I think about "finished."

4) **Security at the data layer.** I moved access control into Postgres row-level security keyed on the authenticated user, instead of scattering checks through app code and hoping I never miss one.

Bonus lesson: building on **Next.js 16** meant the middleware→proxy rename and async request APIs broke every tutorial I found, so I had to read the actual docs. Good habit to be forced into.

Stack: Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind · Zustand · Supabase (Postgres, Auth, RLS) · lightweight-charts · Binance WebSockets · Vercel.

If you work on real-time or fintech systems, I'd really value your critique on what I got wrong.

#LearningInPublic #SoftwareEngineering #NextJS #PostgreSQL #Supabase #WebSockets #SystemDesign

---

## Option C — Short hook (pair with the video)

Taught myself real-time systems by building something that couldn't work without them: a crypto dashboard with live WebSocket prices, real-time charts, and a paper-trading simulator. 📈

Biggest lessons: designing for the connection dropping, why trades belong in a locked database transaction, and never trusting a price from the client.

Next.js 16 · TypeScript · Supabase · Binance WebSockets · Vercel

Live: [DEMO] · Code: [REPO]

#LearningInPublic #NextJS #TypeScript #Supabase #WebSockets

---

## Posting tips

- **Hook is everything.** LinkedIn shows ~2 lines before "…see more." Each option front-loads the learning angle, which reads as authentic and pulls people in.
- **The "here's what confused me, here's what I figured out" structure** consistently outperforms "look what I built." You're already using it, lean into it.
- **Put links in the first comment** if you notice low reach. LinkedIn sometimes throttles posts with outbound links. Post text + native video, then drop `[DEMO]`/`[REPO]` in the first comment.
- **Reply to every comment** in the first hour, it compounds reach. Answering "how did you do X?" with a real explanation shows you actually understand it.
- Tag/hashtag the tech (Supabase and Vercel sometimes reshare community learning builds).

## Honest lines you can add (they build credibility)

- "Current limitation: alerts fire client-side while the app is open. The always-on version is a scheduled edge function, which is what I'm learning next."
- "Not claiming any of this is production-grade. It's a learning build, and I'm posting it partly to find out what I still don't know."

Showing the edges of your own understanding reads as more senior than a flawless-sounding pitch, especially to the engineers you want reading this.
