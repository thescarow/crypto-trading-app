## Crypto Trading App – CBB Assessment

React + TypeScript crypto trading demo built for a Central Bank of Bahrain assessment brief.

### Tech

- React 18 + TypeScript
- Vite
- @tanstack/react-query
- Zustand
- Plain CSS (no UI libraries)

### Run locally

1. Install dependencies with npm install
2. Start the dev server with npm run dev
3. Open http://localhost:5173 in your browser

### Features

- Sticky header with navigation and login
- Home page with crypto assets table, sorting and load-more
- Trade page (login required) with crypto ↔ USD conversion and swap button
- Data sourced from https://api.exchangerate.host (crypto symbols and USD rates)

## Crypto Trading App – React + TypeScript (CBB Assessment)

**Simple crypto trading workspace built with React, TypeScript, React Query, and Zustand.**

This project implements the assessment brief for a **Crypto Trading App** with:

- **Sticky header** with navigation (`Home`, `Trade`) and user info
- **Home page** with crypto assets table, sorting, pagination (load-more), and row actions
- **Trade page** (guarded by login) with crypto amount and fiat (USD) amount fields, live conversion, and **swap** behavior
- **Local-only authentication** (email + password) with a login modal
- **API-powered data** via `https://api.exchangerate.host` (crypto symbols + rates)

The experience is styled as a **Central Bank of Bahrain sandbox** UI, but this is **only for assessment/demo purposes** and is **not an official CBB product or license**.

### Tech Stack

- **React 18** + **TypeScript**
- **Vite** bundler
- **@tanstack/react-query** for data fetching, caching, filtering, and pagination
- **Zustand** for local auth state
- No UI component libraries; styling is implemented with plain CSS.

### Getting Started

- **Prerequisites**: Node.js 18+ and npm

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Authentication

- Click **Login** in the sticky header to open the modal.
- Enter **any valid-looking email** and a password (min 4 chars).
- Authentication is **local only** (stored in `localStorage`), with no external identity provider.
- Once logged in, the **Trade** page becomes fully interactive.

### Home Page – Crypto Assets

- Fetches **crypto symbols + USD rates** from `exchangerate.host` using **React Query**.
- Initially displays **10 assets**, with a **“Load more assets”** button to expand the list by 10 each time.
- Provides **sorting options**:
  - **By asset name**
  - **By asset price (USD)**
- Each asset row shows:
  - **Icon** (symbol badge)
  - **Name**
  - **Symbol**
  - **USD price**
  - **Dropdown actions**: **Buy**, **Sell**, **Trade**
    - `Trade` routes into the Trade tab with the selected asset prefilled.

### Trade Page – Conversion Form

Access is **guarded by login**:

- When **not logged in**:
  - Shows a gated card explaining that trading is restricted to authenticated users.
  - Provides a **“Login to Trade”** button that opens the login modal.

- When **logged in**:
  - Uses **React Query** to fetch a list of assets and their USD prices.
  - Includes:
    1. **Crypto Amount / USD Amount fields**
       - Two inputs representing crypto amount and USD notional.
       - **Live updates** as you type.
    2. **Swap button**
       - Swaps between:
         - **Crypto → USD** (you type crypto amount)
         - **USD → Crypto** (you type USD, crypto amount is calculated)
    3. **Asset dropdown**
       - Choose from the top N crypto assets.
    4. **Rate line**
       - Shows `1 ASSET ≈ $X.XX USD`.

All calculations use the latest exchange rates from `exchangerate.host` (crypto source) and are **purely indicative**.

### API Usage

- **Symbols endpoint**: `GET https://api.exchangerate.host/symbols?source=crypto`
- **Latest rates endpoint** (per page of assets):  
  `GET https://api.exchangerate.host/latest?base=USD&symbols=CODE1,CODE2,...&source=crypto`

These APIs power:

- **Crypto assets listing**
- **Pricing in USD**
- **Real-time Trade-form conversions**

### GitHub Repository

Once you push this project to your own GitHub account, you can share it for assessment.

Example commands:

```bash
git init
git add .
git commit -m "Initial commit – CBB crypto trading app"
git branch -M main
git remote add origin git@github.com:<your-username>/crypto-trading-app.git
git push -u origin main
```

Then provide the assessor with the repo link, e.g.:

`https://github.com/<your-username>/crypto-trading-app`

### Licensing Note

This codebase is prepared **for a Central Bank of Bahrain assessment** under a sandbox-style scenario. It is:

- **Not a production trading system**
- **Not an official product of the Central Bank of Bahrain**
- **Not suitable for real-money trading**

The source code is released under the **MIT License** (see `LICENSE`), with all CBB references used solely to match the assessment brief.

