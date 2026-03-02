import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { CreateApplicationInput, JobApplication } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "applications.db");
const legacyJsonPath = path.join(dataDir, "applications.json");

type ApplicationRow = {
  id: string;
  company: string;
  role: string;
  status: JobApplication["status"];
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  job_url: string | null;
  notes: string | null;
  applied_date: string;
  created_at: string;
  updated_at: string;
};

type LegacyShape = {
  applications: JobApplication[];
};

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

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
            app.id,
            app.company,
            app.role,
            app.status,
            app.location,
            app.salaryMin,
            app.salaryMax,
            app.jobUrl,
            app.notes,
            app.appliedDate,
            app.createdAt,
            app.updatedAt
          );
        }
      });

      migrate(parsed.applications);
    }
  } catch {
    // If legacy JSON is invalid, continue with a clean SQLite database.
  }
}

function toApplication(row: ApplicationRow): JobApplication {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    location: row.location,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    jobUrl: row.job_url,
    notes: row.notes,
    appliedDate: row.applied_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function listApplications(params: { status?: string; search?: string }) {
  const { status, search } = params;
  const clauses: string[] = [];
  const values: string[] = [];

  if (status && status !== "All") {
    clauses.push("status = ?");
    values.push(status);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    if (q.length > 0) {
      clauses.push("(LOWER(company) LIKE ? OR LOWER(role) LIKE ? OR LOWER(location) LIKE ?)");
      const pattern = `%${q}%`;
      values.push(pattern, pattern, pattern);
    }
  }

  let sql = "SELECT * FROM applications";
  if (clauses.length > 0) {
    sql += ` WHERE ${clauses.join(" AND ")}`;
  }
  sql += " ORDER BY updated_at DESC";

  const rows = db.prepare(sql).all(...values) as ApplicationRow[];
  return rows.map(toApplication);
}

export function getApplicationById(id: string) {
  const row = db.prepare("SELECT * FROM applications WHERE id = ?").get(id) as
    | ApplicationRow
    | undefined;

  return row ? toApplication(row) : null;
}

export function createApplication(input: CreateApplicationInput) {
  const now = new Date().toISOString();
  const app: JobApplication = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now
  };

  db.prepare(`
    INSERT INTO applications (
      id, company, role, status, location,
      salary_min, salary_max, job_url, notes,
      applied_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    app.id,
    app.company,
    app.role,
    app.status,
    app.location,
    app.salaryMin,
    app.salaryMax,
    app.jobUrl,
    app.notes,
    app.appliedDate,
    app.createdAt,
    app.updatedAt
  );

  return app;
}

export function updateApplication(id: string, input: Partial<CreateApplicationInput>) {
  const current = getApplicationById(id);
  if (!current) {
    return null;
  }

  const updated: JobApplication = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString()
  };

  db.prepare(`
    UPDATE applications
    SET
      company = ?,
      role = ?,
      status = ?,
      location = ?,
      salary_min = ?,
      salary_max = ?,
      job_url = ?,
      notes = ?,
      applied_date = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    updated.company,
    updated.role,
    updated.status,
    updated.location,
    updated.salaryMin,
    updated.salaryMax,
    updated.jobUrl,
    updated.notes,
    updated.appliedDate,
    updated.updatedAt,
    id
  );

  return updated;
}

export function deleteApplication(id: string) {
  const result = db.prepare("DELETE FROM applications WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getStats() {
  const row = db
    .prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) AS applied,
        SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) AS interviewing,
        SUM(CASE WHEN status = 'Offer' THEN 1 ELSE 0 END) AS offers,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN status = 'Wishlist' THEN 1 ELSE 0 END) AS wishlist
      FROM applications
    `)
    .get() as {
    total: number;
    applied: number | null;
    interviewing: number | null;
    offers: number | null;
    rejected: number | null;
    wishlist: number | null;
  };

  return {
    total: row.total,
    applied: row.applied ?? 0,
    interviewing: row.interviewing ?? 0,
    offers: row.offers ?? 0,
    rejected: row.rejected ?? 0,
    wishlist: row.wishlist ?? 0
  };
}
