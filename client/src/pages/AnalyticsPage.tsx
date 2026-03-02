import { useMemo } from "react";
import type { JobApplication } from "../types/application";
import type { Stats } from "../types/stats";
import { MetricCards } from "../components/analytics/MetricCards";
import { StatusChart } from "../components/analytics/StatusChart";
import { TrendChart } from "../components/analytics/TrendChart";
import { ConversionChart } from "../components/analytics/ConversionChart";
import { SnapshotGrid } from "../components/analytics/SnapshotGrid";
import type { ApplicationStatus } from "../types/application";

type AnalyticsPageProps = {
    applications: JobApplication[];
    stats: Stats | null;
    loading: boolean;
    error: string | null;
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    Wishlist: "#8b5cf6",
    Applied: "#3b82f6",
    Interview: "#f59e0b",
    Offer: "#10b981",
    Rejected: "#64748b",
};

const STATUSES: ApplicationStatus[] = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

function pct(n: number, d: number) {
    if (d === 0) return "0.0";
    return ((n / d) * 100).toFixed(1);
}

function monthKey(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key: string) {
    const [year, month] = key.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString(undefined, { month: "short", year: "numeric" });
}

function recentMonthKeys(n: number) {
    const now = new Date();
    return Array.from({ length: n }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
}

export function AnalyticsPage({ applications, stats, error }: AnalyticsPageProps) {
    const statusBreakdown = useMemo(
        () =>
            STATUSES.map((s) => ({
                name: s,
                value: applications.filter((a) => a.status === s).length,
                color: STATUS_COLORS[s],
            })),
        [applications]
    );

    const monthlyTrend = useMemo(() => {
        const keys = recentMonthKeys(8);
        const counts = applications.reduce<Record<string, number>>((acc, a) => {
            const k = monthKey(a.appliedDate);
            acc[k] = (acc[k] ?? 0) + 1;
            return acc;
        }, {});
        return keys.map((k) => ({ month: formatMonth(k), applications: counts[k] ?? 0 }));
    }, [applications]);

    const conversionFlow = useMemo(() => {
        const applied = applications.filter((a) => a.status !== "Wishlist").length;
        const interview = applications.filter((a) => a.status === "Interview" || a.status === "Offer").length;
        const offer = applications.filter((a) => a.status === "Offer").length;
        return [
            { stage: "Applied", count: applied },
            { stage: "Interview", count: interview },
            { stage: "Offer", count: offer },
        ];
    }, [applications]);

    const metrics = useMemo(() => {
        const nonWishlist = applications.filter((a) => a.status !== "Wishlist").length;
        const interviewOffer = applications.filter((a) => a.status === "Interview" || a.status === "Offer").length;
        const offers = applications.filter((a) => a.status === "Offer").length;
        const rejected = applications.filter((a) => a.status === "Rejected").length;
        const midpoints = applications
            .map((a) => {
                if (a.salaryMin !== null && a.salaryMax !== null) return (a.salaryMin + a.salaryMax) / 2;
                return a.salaryMin ?? a.salaryMax;
            })
            .filter((v): v is number => v !== null);
        const avgSalary = midpoints.length > 0
            ? Math.round(midpoints.reduce((s, v) => s + v, 0) / midpoints.length)
            : null;
        return {
            responseRate: pct(interviewOffer + rejected, nonWishlist),
            interviewRate: pct(interviewOffer, nonWishlist),
            offerRate: pct(offers, nonWishlist),
            avgSalary,
        };
    }, [applications]);

    return (
        <>
            {error && <p className="error-banner" role="alert">{error}</p>}
            <MetricCards stats={stats} {...metrics} />
            <div className="charts-grid">
                <StatusChart data={statusBreakdown} />
                <TrendChart data={monthlyTrend} />
                <ConversionChart data={conversionFlow} />
            </div>
            <SnapshotGrid stats={stats} />
        </>
    );
}
