import { motion } from "framer-motion";
import type { Stats } from "@/types/stats";

type MetricCardsProps = {
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    avgSalary: number | null;
};

function MetricCard({
    label, value, color, delay,
}: { label: string; value: string; color: string; delay: number }) {
    return (
        <motion.div
            className="jarvis-stat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
        >
            <p
                className="text-[0.7rem] font-bold uppercase tracking-[0.12em]"
                style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}
            >
                {label}
            </p>
            <p
                className="mt-1 text-3xl font-semibold leading-none tracking-tight"
                style={{ fontFamily: "var(--font-mono)", color }}
            >
                {value}
            </p>
        </motion.div>
    );
}

export function MetricCards({ responseRate, interviewRate, offerRate, avgSalary }: MetricCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard label="Response Rate" value={`${responseRate.toFixed(1)}%`} color="var(--jarvis-cyan)" delay={0} />
            <MetricCard label="Interview Rate" value={`${interviewRate.toFixed(1)}%`} color="var(--s-interview-fg)" delay={0.07} />
            <MetricCard label="Offer Rate" value={`${offerRate.toFixed(1)}%`} color="var(--s-offer-fg)" delay={0.14} />
            <MetricCard
                label="Avg. Salary"
                value={avgSalary != null ? `$${(avgSalary / 1000).toFixed(0)}k` : "N/A"}
                color="var(--jarvis-amber)"
                delay={0.21}
            />
        </div>
    );
}
