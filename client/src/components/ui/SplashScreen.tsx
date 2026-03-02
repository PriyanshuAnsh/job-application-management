import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react";

/** Letters for the staggered title animation */
const TITLE = "JOB APPLICATION MANAGER";

export function SplashScreen({ onDone }: { onDone: () => void }) {
    const [progress, setProgress] = useState(0);

    // Kick off progress bar and auto-dismiss
    useEffect(() => {
        const DURATION = 2400; // ms total
        const start = performance.now();
        let raf: number;

        const tick = (now: number) => {
            const pct = Math.min((now - start) / DURATION, 1);
            setProgress(pct);
            if (pct < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                // slight pause before fade
                setTimeout(onDone, 300);
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [onDone]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "#020c1b" }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
        >
            {/* Dot grid */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(6,182,212,0.15) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Concentric ring animations */}
            {[120, 80, 50].map((r, i) => (
                <motion.div
                    key={r}
                    className="absolute rounded-full border"
                    style={{
                        width: r * 2,
                        height: r * 2,
                        borderColor: "rgba(6,182,212,0.15)",
                    }}
                    animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}

            {/* Central icon */}
            <motion.div
                className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{
                    background: "rgba(6,182,212,0.08)",
                    border: "1px solid rgba(6,182,212,0.35)",
                    boxShadow: "0 0 40px rgba(6,182,212,0.3), inset 0 0 20px rgba(6,182,212,0.05)",
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
                {/* Rotating scan ring */}
                <motion.div
                    className="absolute inset-[-8px] rounded-2xl"
                    style={{
                        border: "1px solid transparent",
                        borderTopColor: "rgba(6,182,212,0.6)",
                        borderRightColor: "rgba(6,182,212,0.2)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <Briefcase className="h-9 w-9" style={{ color: "#06b6d4" }} />
            </motion.div>

            {/* Title — letter-by-letter stagger */}
            <div
                className="mb-2 flex gap-[2px] overflow-hidden"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.2em" }}
            >
                {TITLE.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        style={{ color: char === " " ? "transparent" : "#cffafe", display: "inline-block" }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.03, ease: "easeOut" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </div>

            {/* Subtext with blinking cursor */}
            <motion.p
                className="mb-10 text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: "rgba(6,182,212,0.5)", fontFamily: "var(--font-mono)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
            >
                Initializing system
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                >
                    _
                </motion.span>
            </motion.p>

            {/* Progress bar */}
            <div
                className="relative h-px w-56 overflow-hidden rounded-full"
                style={{ background: "rgba(6,182,212,0.12)" }}
            >
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        background: "linear-gradient(90deg, rgba(6,182,212,0.4), #06b6d4)",
                        boxShadow: "0 0 8px rgba(6,182,212,0.6)",
                    }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.05 }}
                />
            </div>

            {/* Percentage */}
            <motion.p
                className="mt-2 text-[0.65rem] font-bold"
                style={{ color: "rgba(6,182,212,0.35)", fontFamily: "var(--font-mono)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {Math.round(progress * 100)}%
            </motion.p>
        </motion.div>
    );
}
