import { useMemo } from "react";
import { motion } from "framer-motion";
import type { JobApplication } from "@/types/application";
import type { Stats } from "@/types/stats";
import type { ApplicationStatus } from "@/types/application";
import { MetricCards } from "@/components/analytics/MetricCards";
import { StatusChart } from "@/components/analytics/StatusChart";
import { TrendChart } from "@/components/analytics/TrendChart";
import { ConversionChart } from "@/components/analytics/ConversionChart";
import { SnapshotGrid } from "@/components/analytics/SnapshotGrid";

type AnalyticsPageProps = {
    applications: JobApplication[];
    stats: Stats | null;
    loading: boolean;
    error: string | null;
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    Wishlist: "#8b5cf6", Applied: "#06b6d4", Interview: "#f59e0b",
    Offer: "#10b981", Rejected: "#64748b",
};

const STATUSES: ApplicationStatus[] = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

function pct(n: number, d: number) {
    return d === 0 ? 0 : (n / d) * 100;
}

function monthKey(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key: string) {
    const [year, month] = key.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString(undefined, { month: "short", year: "2-digit" });
}

function recentMonthKeys(n: number) {
    const now = new Date();
    return Array.from({ length: n }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
}

function ChartPanel({ title, sub, children, delay = 0 }: {
    title: string; sub: string; children: React.ReactNode; delay?: number;
}) {
    return (
        <motion.div
            className="jarvis-panel p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="mb-1">
                <h3
                    className="text-base font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--jarvis-text)" }}
                >
                    {title}
                </h3>
                <p className="text-xs" style={{ color: "var(--jarvis-text-faint)" }}>{sub}</p>
            </div>
            {children}
        </motion.div>
    );
}

export function AnalyticsPage({ applications }: AnalyticsPageProps) {
    const statusBreakdown = useMemo(
        () => STATUSES.map(s => ({ name: s, value: applications.filter(a => a.status === s).length, color: STATUS_COLORS[s] })),
        [applications]
    );

    const monthlyTrend = useMemo(() => {
        const keys = recentMonthKeys(8);
        const counts = applications.reduce<Record<string, number>>((acc, a) => {
            const k = monthKey(a.appliedDate);
            acc[k] = (acc[k] ?? 0) + 1;
            return acc;
        }, {});
        return keys.map(k => ({ month: formatMonth(k), count: counts[k] ?? 0 }));
    }, [applications]);

    const conversionFlow = useMemo(() => {
        const applied = applications.filter(a => a.status !== "Wishlist").length;
        const interview = applications.filter(a => a.status === "Interview" || a.status === "Offer").length;
        const offer = applications.filter(a => a.status === "Offer").length;
        return [{ stage: "Applied", count: applied }, { stage: "Interview", count: interview }, { stage: "Offer", count: offer }];
    }, [applications]);

    const metrics = useMemo(() => {
        const nonWishlist = applications.filter(a => a.status !== "Wishlist").length;
        const interviewOffer = applications.filter(a => a.status === "Interview" || a.status === "Offer").length;
        const offers = applications.filter(a => a.status === "Offer").length;
        const rejected = applications.filter(a => a.status === "Rejected").length;
        const midpoints = applications
            .map(a => a.salaryMin != null && a.salaryMax != null ? (a.salaryMin + a.salaryMax) / 2 : a.salaryMin ?? a.salaryMax)
            .filter((v): v is number => v !== null);
        const avgSalary = midpoints.length > 0 ? Math.round(midpoints.reduce((s, v) => s + v, 0) / midpoints.length) : null;
        return {
            responseRate: pct(interviewOffer + rejected, nonWishlist),
            interviewRate: pct(interviewOffer, nonWishlist),
            offerRate: pct(offers, nonWishlist),
            avgSalary,
        };
    }, [applications]);

    const snapshotItems = useMemo(() => [
        { label: "Total Applied", value: applications.filter(a => a.status !== "Wishlist").length, color: "var(--jarvis-cyan)" },
        { label: "In Interview", value: applications.filter(a => a.status === "Interview").length, color: "var(--s-interview-fg)" },
        { label: "Offers Received", value: applications.filter(a => a.status === "Offer").length, color: "var(--s-offer-fg)" },
        { label: "Rejected", value: applications.filter(a => a.status === "Rejected").length, color: "var(--s-rejected-fg)" },
    ], [applications]);

    return (
        <>
            <MetricCards {...metrics} />

            {/* Charts grid — 2 columns, last child spans full width if odd */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 [&>:last-child:nth-child(odd)]:sm:col-span-2">
                <ChartPanel title="Status Distribution" sub="Pipeline split by current stage." delay={0.1}>
                    <StatusChart data={statusBreakdown} />
                </ChartPanel>
                <ChartPanel title="Application Trend" sub="Applications submitted in the last 8 months." delay={0.17}>
                    <TrendChart data={monthlyTrend} />
                </ChartPanel>
                <ChartPanel title="Conversion Flow" sub="From applications to interviews and offers." delay={0.24}>
                    <ConversionChart data={conversionFlow} />
                </ChartPanel>
            </div>

            <motion.div
                className="jarvis-panel p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
            >
                <h3
                    className="mb-3 text-sm font-bold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-display)", color: "var(--jarvis-text-faint)" }}
                >
                    Pipeline Snapshot
                </h3>
                <SnapshotGrid items={snapshotItems} />
            </motion.div>
        </>
    );
}
