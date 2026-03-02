import { motion } from "framer-motion";
import { Briefcase, Cpu } from "lucide-react";

export function Header() {
    return (
        <motion.header
            className="jarvis-panel relative overflow-hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Scan-line sweep on load */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-70"
                style={{
                    background: "linear-gradient(90deg, transparent, #06b6d4, transparent)",
                    animation: "jarvis-scanline 1.8s ease-out 0.2s 1 forwards",
                }}
            />

            <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-11 w-11 items-center justify-center rounded-lg"
                        style={{
                            background: "rgba(6,182,212,0.1)",
                            border: "1px solid rgba(6,182,212,0.3)",
                            boxShadow: "0 0 16px rgba(6,182,212,0.2)",
                        }}
                    >
                        <Briefcase className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div>
                        <div>
                            <h1
                                className="text-2xl font-bold leading-none tracking-tight"
                                style={{ fontFamily: "var(--font-display)", color: "var(--jarvis-text)" }}
                            >
                                Job Application Manager
                            </h1>
                            <p className="mt-1 text-sm" style={{ color: "var(--jarvis-text-dim)" }}>
                                Track roles, outcomes, and pipeline progress in one command center.
                            </p>
                        </div>
                    </div>
                </div>

                <Cpu
                    className="h-10 w-10 opacity-20"
                    style={{ color: "var(--jarvis-cyan)", animation: "jarvis-glow-pulse 3s ease-in-out infinite" }}
                />
            </div>

            {/* Bottom accent bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)" }}
            />
        </motion.header>
    );
}
