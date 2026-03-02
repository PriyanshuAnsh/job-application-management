import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import type { JobApplication } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dataDir = path.join(__dirname, "..", "..", "data");
const dbPath = path.join(dataDir, "applications.db");
const legacyJsonPath = path.join(dataDir, "applications.json");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected')),
    location TEXT NOT NULL,
    salary_min REAL,
    salary_max REAL,
    job_url TEXT,
    notes TEXT,
    applied_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  CREATE INDEX IF NOT EXISTS idx_applications_updated_at ON applications(updated_at DESC);
`);

// One-time migration from legacy JSON storage
type LegacyShape = { applications: JobApplication[] };

const countRow = db.prepare("SELECT COUNT(*) AS count FROM applications").get() as { count: number };

if (countRow.count === 0 && fs.existsSync(legacyJsonPath)) {
    try {
        const raw = fs.readFileSync(legacyJsonPath, "utf-8");
        const parsed = JSON.parse(raw) as LegacyShape;

        if (Array.isArray(parsed.applications) && parsed.applications.length > 0) {
            const insert = db.prepare(`
        INSERT INTO applications (
          id, company, role, status, location,
          salary_min, salary_max, job_url, notes,
          applied_date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            const migrate = db.transaction((items: JobApplication[]) => {
                for (const app of items) {
                    insert.run(
                        app.id, app.company, app.role, app.status, app.location,
                        app.salaryMin, app.salaryMax, app.jobUrl, app.notes,
                        app.appliedDate, app.createdAt, app.updatedAt
                    );
                }
            });

            migrate(parsed.applications);
        }
    } catch {
        // If legacy JSON is invalid, continue with a clean database.
    }
}
