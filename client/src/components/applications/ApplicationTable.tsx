import { useEffect, useMemo, useRef, useState } from "react";
import { applicationStatuses } from "../../types/application";
import type { CreateApplicationPayload, JobApplication } from "../../types/application";
import { StatusBadge } from "../ui/StatusBadge";
import { EditApplicationDrawer } from "./EditApplicationDrawer";

type SortKey = "company" | "role" | "appliedDate" | "status" | null;
type SortDir = "asc" | "desc";

type ApplicationTableProps = {
    applications: JobApplication[];
    loading: boolean;
    onStatusChange: (id: string, nextStatus: JobApplication["status"]) => Promise<void>;
    onDelete: (id: string, company: string) => Promise<void>;
    onUpdate: (id: string, payload: Partial<CreateApplicationPayload>) => Promise<void>;
};

const PILL_STATUSES = ["All", ...applicationStatuses] as const;

export function ApplicationTable({
    applications,
    loading,
    onStatusChange,
    onDelete,
    onUpdate,
}: ApplicationTableProps) {
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editApp, setEditApp] = useState<JobApplication | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut: "/" focuses the search
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement).tagName;
            if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return applications.filter((app) => {
            if (statusFilter !== "All" && app.status !== statusFilter) return false;
            if (!q) return true;
            return (
                app.company.toLowerCase().includes(q) ||
                app.role.toLowerCase().includes(q) ||
                app.location.toLowerCase().includes(q)
            );
        });
    }, [applications, search, statusFilter]);

    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            let cmp = 0;
            if (sortKey === "company") cmp = a.company.localeCompare(b.company);
            if (sortKey === "role") cmp = a.role.localeCompare(b.role);
            if (sortKey === "appliedDate") cmp = a.appliedDate.localeCompare(b.appliedDate);
            if (sortKey === "status") cmp = a.status.localeCompare(b.status);
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    function SortArrow({ col }: { col: SortKey }) {
        if (sortKey !== col) return <span className="sort-arrow sort-arrow--idle">↕</span>;
        return <span className="sort-arrow sort-arrow--active">{sortDir === "asc" ? "↑" : "↓"}</span>;
    }

    async function handleDeleteConfirmed(app: JobApplication) {
        await onDelete(app.id, app.company);
        setConfirmDeleteId(null);
    }

    return (
        <>
            {/* Edit drawer */}
            <EditApplicationDrawer
                application={editApp}
                open={editApp !== null}
                onClose={() => setEditApp(null)}
                onUpdate={onUpdate}
            />

            <section className="panel">
                {/* Header row */}
                <div className="table-header">
                    <div className="table-header__left">
                        <h2>Pipeline</h2>
                        <span className="table-count">
                            {sorted.length} / {applications.length}
                        </span>
                    </div>
                    <div className="search-wrap">
                        <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <input
                            ref={searchRef}
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search… (press "/" to focus)'
                        />
                        {search && (
                            <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter pills */}
                <div className="filter-pills" role="group" aria-label="Filter by status">
                    {PILL_STATUSES.map((s) => (
                        <button
                            key={s}
                            className={`pill${statusFilter === s ? " pill--active" : ""}${s !== "All" ? ` pill--${s.toLowerCase()}` : ""}`}
                            onClick={() => setStatusFilter(s)}
                            type="button"
                        >
                            {s !== "All" && <span className="pill__dot" />}
                            {s}
                        </button>
                    ))}
                </div>

                {loading && <p className="loading-hint">Refreshing…</p>}

                {/* Table */}
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th className="th--sortable" onClick={() => handleSort("company")}>
                                    Company <SortArrow col="company" />
                                </th>
                                <th className="th--sortable" onClick={() => handleSort("role")}>
                                    Role <SortArrow col="role" />
                                </th>
                                <th className="th--sortable" onClick={() => handleSort("status")}>
                                    Status <SortArrow col="status" />
                                </th>
                                <th>Location</th>
                                <th className="th--sortable" onClick={() => handleSort("appliedDate")}>
                                    Applied <SortArrow col="appliedDate" />
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="table-empty">
                                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                                                <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
                                                <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                            </svg>
                                            {applications.length === 0
                                                ? "No applications yet — add your first above!"
                                                : "No applications match this filter."}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sorted.map((app) => (
                                    <tr key={app.id} className={confirmDeleteId === app.id ? "tr--confirm" : ""}>
                                        {confirmDeleteId === app.id ? (
                                            <td colSpan={6}>
                                                <div className="inline-confirm">
                                                    <span>Delete <strong>{app.company}</strong>?</span>
                                                    <button
                                                        className="btn btn--danger btn--sm"
                                                        onClick={() => handleDeleteConfirmed(app)}
                                                    >
                                                        Yes, delete
                                                    </button>
                                                    <button
                                                        className="btn btn--ghost btn--sm"
                                                        onClick={() => setConfirmDeleteId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        ) : (
                                            <>
                                                <td className="td--company">{app.company}</td>
                                                <td className="td--role">{app.role}</td>
                                                <td>
                                                    <div className="status-cell">
                                                        <StatusBadge status={app.status} />
                                                        <select
                                                            className="status-select"
                                                            value={app.status}
                                                            onChange={(e) =>
                                                                onStatusChange(app.id, e.target.value as JobApplication["status"])
                                                            }
                                                            aria-label={`Change status for ${app.company}`}
                                                        >
                                                            {applicationStatuses.map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>{app.location}</td>
                                                <td className="td--mono">{app.appliedDate}</td>
                                                <td>
                                                    <div className="row-actions">
                                                        {app.jobUrl && (
                                                            <a
                                                                href={app.jobUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="btn btn--ghost btn--sm"
                                                            >
                                                                View job ↗
                                                            </a>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn--ghost btn--sm"
                                                            onClick={() => setEditApp(app)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn--danger btn--sm"
                                                            onClick={() => setConfirmDeleteId(app.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
