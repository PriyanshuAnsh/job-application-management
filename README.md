# Job Application Management

A full-stack **J.A.R.V.I.S.-themed** application to track job applications, visualize pipeline status, and manage outcomes — built with React, TypeScript, Vite, and Node/Express.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 + custom JARVIS design tokens |
| UI Components | Radix UI primitives (Dialog, Select, Label, etc.) |
| Animations | Framer Motion |
| Charts | Recharts |
| Notifications | Sonner |
| Backend | Node.js + Express + TypeScript (via `tsx`) |
| Database | SQLite (`better-sqlite3`) |
| Validation | Zod |

---

## Features

- **Dashboard** — live metrics: total applications, applied, interviews, and offers
- **Status pipeline** — `Wishlist → Applied → Interview → Offer → Rejected`
- **Donut chart** — visual breakdown of applications by status
- **Create / Edit / Delete** applications via modal dialogs
- **Filter by status** and **search** by company, role, or location
- **Toast notifications** (Sonner) for all CRUD actions
- **One-time migration** from legacy JSON storage if `server/data/applications.json` exists

---

## Prerequisites — Installing Node.js & npm

You need **Node.js v18 or later** (npm is bundled with it).

### macOS (recommended: use `nvm`)

```bash
# 1. Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Restart your terminal, then install the latest LTS release
nvm install --lts
nvm use --lts

# 3. Verify
node -v   # e.g. v22.x.x
npm -v    # e.g. 10.x.x
```

### macOS (alternative: Homebrew)

```bash
brew install node
```

### Windows

Download and run the installer from [nodejs.org](https://nodejs.org) (choose the **LTS** version).

### Verify your installation

```bash
node -v   # should print v18.x.x or higher
npm -v    # should print 9.x.x or higher
```

---

## Run Locally

This is a **npm workspace** monorepo. All commands are run from the **project root**.

### 1. Install all dependencies

```bash
npm install
```

> This installs dependencies for both `client/` and `server/` workspaces in one step.

### 2. Start the dev servers

```bash
npm run dev
```

This concurrently starts:

| Process | URL |
|---|---|
| API server | `http://localhost:4000` |
| Web app (Vite) | `http://localhost:5173` |

---

## Other Scripts

| Command | Description |
|---|---|
| `npm run build` | Production build for both client and server |
| `npm run typecheck` | TypeScript type-check for both workspaces |

---

## Project Structure

```
job-application-management/
├── client/               # React + Vite frontend
│   └── src/
│       ├── components/   # UI, analytics, and layout components
│       ├── pages/        # ApplicationsPage
│       ├── hooks/        # useApplicationData
│       ├── lib/api/      # Typed fetch helpers
│       ├── context/      # React context
│       ├── styles/       # JARVIS CSS design system
│       └── types/        # Shared TypeScript types
└── server/               # Express API
    └── src/
        ├── db/           # SQLite connection & schema
        ├── routes/       # API route handlers
        └── index.ts      # Entry point
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/applications` | List applications (supports `?status=` & `?search=`) |
| `GET` | `/api/applications/:id` | Get a single application |
| `POST` | `/api/applications` | Create a new application |
| `PATCH` | `/api/applications/:id` | Update an application |
| `DELETE` | `/api/applications/:id` | Delete an application |
| `GET` | `/api/stats` | Aggregate stats (total, by status) |

---

## Environment Variables (Optional)

To point the frontend at a different API URL, create `client/.env`:

```bash
VITE_API_URL=http://localhost:4000
```

The default is `http://localhost:4000` when this file is absent.
