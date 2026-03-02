import { randomUUID } from "node:crypto";
import { db } from "../db/connection.js";
import type { CreateApplicationInput, JobApplication } from "../types.js";

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
        updatedAt: row.updated_at,
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
    if (clauses.length > 0) sql += ` WHERE ${clauses.join(" AND ")}`;
    sql += " ORDER BY updated_at DESC";

    const rows = db.prepare(sql).all(...values) as ApplicationRow[];
    return rows.map(toApplication);
}

export function getApplicationById(id: string): JobApplication | null {
    const row = db.prepare("SELECT * FROM applications WHERE id = ?").get(id) as
        | ApplicationRow
        | undefined;
    return row ? toApplication(row) : null;
}

export function createApplication(input: CreateApplicationInput): JobApplication {
    const now = new Date().toISOString();
    const app: JobApplication = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };

    db.prepare(`
    INSERT INTO applications (
      id, company, role, status, location,
      salary_min, salary_max, job_url, notes,
      applied_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        app.id, app.company, app.role, app.status, app.location,
        app.salaryMin, app.salaryMax, app.jobUrl, app.notes,
        app.appliedDate, app.createdAt, app.updatedAt
    );

    return app;
}

export function updateApplication(
    id: string,
    input: Partial<CreateApplicationInput>
): JobApplication | null {
    const current = getApplicationById(id);
    if (!current) return null;

    const updated: JobApplication = { ...current, ...input, updatedAt: new Date().toISOString() };

    db.prepare(`
    UPDATE applications
    SET company = ?, role = ?, status = ?, location = ?,
        salary_min = ?, salary_max = ?, job_url = ?, notes = ?,
        applied_date = ?, updated_at = ?
    WHERE id = ?
  `).run(
        updated.company, updated.role, updated.status, updated.location,
        updated.salaryMin, updated.salaryMax, updated.jobUrl, updated.notes,
        updated.appliedDate, updated.updatedAt, id
    );

    return updated;
}

export function deleteApplication(id: string): boolean {
    const result = db.prepare("DELETE FROM applications WHERE id = ?").run(id);
    return result.changes > 0;
}

export function getStats() {
    const row = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'Applied'    THEN 1 ELSE 0 END) AS applied,
      SUM(CASE WHEN status = 'Interview'  THEN 1 ELSE 0 END) AS interviewing,
      SUM(CASE WHEN status = 'Offer'      THEN 1 ELSE 0 END) AS offers,
      SUM(CASE WHEN status = 'Rejected'   THEN 1 ELSE 0 END) AS rejected,
      SUM(CASE WHEN status = 'Wishlist'   THEN 1 ELSE 0 END) AS wishlist
    FROM applications
  `).get() as {
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
        wishlist: row.wishlist ?? 0,
    };
}
