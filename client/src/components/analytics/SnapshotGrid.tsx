import { motion } from "framer-motion";

type SnapshotItem = { label: string; value: string | number; color?: string };

type SnapshotGridProps = {
    items: SnapshotItem[];
};

export function SnapshotGrid({ items }: SnapshotGridProps) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {items.map((item, i) => (
                <motion.div
                    key={item.label}
                    className="rounded-lg border px-3 py-3"
                    style={{
                        background: "rgba(6,182,212,0.04)",
                        borderColor: "var(--jarvis-cyan-border)",
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                    <p
                        className="text-[0.65rem] font-bold uppercase tracking-[0.12em]"
                        style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}
                    >
                        {item.label}
                    </p>
                    <p
                        className="mt-1 text-2xl font-semibold leading-none"
                        style={{ fontFamily: "var(--font-mono)", color: item.color ?? "var(--jarvis-cyan)" }}
                    >
                        {item.value}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
