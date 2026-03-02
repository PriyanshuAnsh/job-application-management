# Job Application Management

A full-stack application to track job applications, pipeline status, and outcomes.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Persistence: SQLite (`server/data/applications.db`)

## Features

- Create, list, update, and delete job applications
- Track status (`Wishlist`, `Applied`, `Interview`, `Offer`, `Rejected`)
- Filter by status and search by company/role/location
- Dashboard metrics for total, applied, interviews, and offers
- One-time migration from legacy JSON storage if `server/data/applications.json` exists

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start server and client:

```bash
npm run dev
```

- API runs on `http://localhost:4000`
- Web app runs on `http://localhost:5173`

## API summary

- `GET /health`
- `GET /api/applications?status=&search=`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/stats`

## Optional frontend API override

Create `client/.env`:

```bash
VITE_API_URL=http://localhost:4000
```
