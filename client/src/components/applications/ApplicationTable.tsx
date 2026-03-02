import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { applicationStatuses } from "@/types/application";
import type { CreateApplicationPayload, JobApplication } from "@/types/application";
import { EditApplicationDrawer } from "./EditApplicationDrawer";

type SortKey = "company" | "role" | "appliedDate" | "status" | null;
type SortDir = "asc" | "desc";

const PILLS = ["All", ...applicationStatuses] as const;

type ApplicationTableProps = {
    applications: JobApplication[];
    loading: boolean;
    onStatusChange: (id: string, next: JobApplication["status"]) => Promise<void>;
    onDelete: (id: string, company: string) => Promise<void>;
    onUpdate: (id: string, payload: Partial<CreateApplicationPayload>) => Promise<void>;
};

export function ApplicationTable({
    applications, loading, onStatusChange, onDelete, onUpdate,
}: ApplicationTableProps) {
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editApp, setEditApp] = useState<JobApplication | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName;
            if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    function handleSort(key: SortKey) {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return applications.filter(app => {
            if (statusFilter !== "All" && app.status !== statusFilter) return false;
            if (!q) return true;
            return app.company.toLowerCase().includes(q) ||
                app.role.toLowerCase().includes(q) ||
                app.location.toLowerCase().includes(q);
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

    function SortIndicator({ col }: { col: SortKey }) {
        if (sortKey !== col) return <span className="ml-1 opacity-25">↕</span>;
        return <span className="ml-1 text-cyan-400">{sortDir === "asc" ? "↑" : "↓"}</span>;
    }

    return (
        <>
            <EditApplicationDrawer
                application={editApp}
                open={editApp !== null}
                onClose={() => setEditApp(null)}
                onUpdate={onUpdate}
            />

            <motion.section
                className="jarvis-panel p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
            >
                {/* Header row */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <h2
                            className="text-lg font-bold"
                            style={{ fontFamily: "var(--font-display)", color: "var(--jarvis-text)" }}
                        >
                            Pipeline
                        </h2>
                        <span
                            className="rounded-full border px-2.5 py-0.5 text-xs font-bold"
                            style={{ borderColor: "var(--jarvis-cyan-border)", color: "var(--jarvis-text-faint)", fontFamily: "var(--font-mono)" }}
                        >
                            {sorted.length}/{applications.length}
                        </span>
                    </div>

                    {/* Search */}
                    <div className="relative flex items-center">
                        <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5" style={{ color: "var(--jarvis-text-faint)" }} />
                        <Input
                            ref={searchRef}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder='Search… ("/" to focus)'
                            className="jarvis-input pl-8 pr-8 text-sm"
                            style={{ minWidth: 260 }}
                        />
                        {search && (
                            <button
                                className="absolute right-2 text-xs transition-colors"
                                onClick={() => setSearch("")}
                                style={{ color: "var(--jarvis-text-faint)" }}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Status filter pills */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {PILLS.map(s => (
                        <button
                            key={s}
                            type="button"
                            className={`jarvis-pill${statusFilter === s ? " active" : ""}`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s !== "All" && (
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{
                                        background: s === "Wishlist" ? "var(--s-wishlist-fg)"
                                            : s === "Applied" ? "var(--s-applied-fg)"
                                                : s === "Interview" ? "var(--s-interview-fg)"
                                                    : s === "Offer" ? "var(--s-offer-fg)"
                                                        : "var(--s-rejected-fg)",
                                    }}
                                />
                            )}
                            {s}
                        </button>
                    ))}
                </div>

                {loading && (
                    <p className="mb-2 text-xs" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-mono)" }}>
                        REFRESHING DATA…
                    </p>
                )}

                {/* Table */}
                <div className="overflow-auto rounded-lg border" style={{ borderColor: "var(--jarvis-cyan-border)", background: "rgba(2,12,27,0.6)" }}>
                    <table className="jarvis-table w-full min-w-[700px] border-collapse">
                        <thead style={{ background: "rgba(6,182,212,0.04)" }}>
                            <tr>
                                {(
                                    [
                                        { key: "company", label: "Company" },
                                        { key: "role", label: "Role" },
                                        { key: "status", label: "Status" },
                                        { key: null, label: "Location" },
                                        { key: "appliedDate", label: "Applied" },
                                        { key: null, label: "Actions" },
                                    ] as const
                                ).map(({ key, label }) => (
                                    <th
                                        key={label}
                                        className={key ? "sortable" : ""}
                                        onClick={key ? () => handleSort(key) : undefined}
                                    >
                                        {label}
                                        {key && <SortIndicator col={key} />}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {sorted.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="flex flex-col items-center gap-2 py-14 text-center">
                                                <AlertTriangle className="h-8 w-8 opacity-20" style={{ color: "var(--jarvis-cyan)" }} />
                                                <p className="text-sm" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>
                                                    {applications.length === 0
                                                        ? "NO APPLICATIONS LOGGED — ADD YOUR FIRST ABOVE"
                                                        : "NO MATCHES FOR CURRENT FILTER"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sorted.map((app, i) => (
                                        <motion.tr
                                            key={app.id}
                                            className={confirmDeleteId === app.id ? "jarvis-confirm-row" : ""}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 8 }}
                                            transition={{ duration: 0.2, delay: i * 0.03 }}
                                        >
                                            {confirmDeleteId === app.id ? (
                                                <td colSpan={6}>
                                                    <div className="flex items-center gap-4 py-1">
                                                        <AlertTriangle className="h-4 w-4" style={{ color: "var(--jarvis-amber)" }} />
                                                        <span className="text-sm" style={{ color: "var(--jarvis-text-dim)" }}>
                                                            Delete <strong style={{ color: "var(--jarvis-text)" }}>{app.company}</strong>?
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            className="jarvis-btn-danger h-7 px-3 text-xs"
                                                            onClick={async () => { await onDelete(app.id, app.company); setConfirmDeleteId(null); }}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="jarvis-btn-ghost h-7 px-3 text-xs"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </td>
                                            ) : (
                                                <>
                                                    <td>
                                                        <span className="font-bold" style={{ color: "var(--jarvis-text)", fontFamily: "var(--font-display)", fontSize: "0.95rem" }}>
                                                            {app.company}
                                                        </span>
                                                    </td>
                                                    <td>{app.role}</td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <StatusBadge status={app.status} />
                                                            <Select
                                                                value={app.status}
                                                                onValueChange={v => onStatusChange(app.id, v as JobApplication["status"])}
                                                            >
                                                                <SelectTrigger
                                                                    className="jarvis-input h-7 w-auto min-w-0 border-0 bg-transparent px-1.5 py-0 text-xs shadow-none focus:ring-0"
                                                                    style={{ color: "var(--jarvis-text-faint)" }}
                                                                >
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent style={{ background: "var(--jarvis-surface-2)", border: "1px solid var(--jarvis-cyan-border)", color: "var(--jarvis-text)" }}>
                                                                    {applicationStatuses.map(s => (
                                                                        <SelectItem key={s} value={s} className="focus:bg-cyan-500/10 focus:text-cyan-300 text-xs">{s}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: "var(--jarvis-text-dim)" }}>{app.location}</td>
                                                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--jarvis-text-faint)" }}>
                                                        {app.appliedDate}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center gap-1.5">
                                                            {app.jobUrl && (
                                                                <a
                                                                    href={app.jobUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="jarvis-btn-ghost rounded px-2 py-1 text-xs"
                                                                >
                                                                    View ↗
                                                                </a>
                                                            )}
                                                            <Button size="sm" className="jarvis-btn-ghost h-7 px-2.5 text-xs" onClick={() => setEditApp(app)}>
                                                                Edit
                                                            </Button>
                                                            <Button size="sm" className="jarvis-btn-danger h-7 px-2.5 text-xs" onClick={() => setConfirmDeleteId(app.id)}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </>
    );
}
