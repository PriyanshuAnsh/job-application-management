import { motion } from "framer-motion";
import type { Stats } from "@/types/stats";

const CARDS = [
    { key: "total", label: "Total", color: "var(--jarvis-cyan)" },
    { key: "applied", label: "Applied", color: "var(--s-applied-fg)" },
    { key: "interview", label: "Interview", color: "var(--s-interview-fg)" },
    { key: "offers", label: "Offers", color: "var(--s-offer-fg)" },
] as const;

type StatsCardsProps = {
    stats: Stats | null;
};

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CARDS.map(({ key, label, color }, i) => {
                const value = stats?.[key as keyof Stats] ?? 0;
                return (
                    <motion.div
                        key={key}
                        className="jarvis-stat-card"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                    >
                        <p
                            className="text-[0.7rem] font-bold uppercase tracking-[0.12em]"
                            style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}
                        >
                            {label}
                        </p>
                        <p
                            className="mt-1 text-4xl font-semibold leading-none tracking-tight"
                            style={{ fontFamily: "var(--font-mono)", color }}
                        >
                            {value}
                        </p>
                    </motion.div>
                );
            })}
        </div>
    );
}
