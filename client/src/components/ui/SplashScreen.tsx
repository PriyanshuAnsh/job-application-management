import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

/** Full-screen grid of 0/1 that randomly flips cells each frame */
function DigitalScramble() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const FONT_SIZE = 14;
        const GAP = 2;
        const CELL = FONT_SIZE + GAP;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        let cols = Math.ceil(w / CELL);
        let rows = Math.ceil(h / CELL);

        // Each cell: bit value + brightness tier
        type Cell = { v: 0 | 1; bright: number }; // bright 0–1
        let grid: Cell[][] = [];

        function initGrid() {
            grid = Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => ({
                    v: (Math.random() > 0.5 ? 1 : 0) as 0 | 1,
                    bright: Math.random() * 0.55 + 0.05,
                }))
            );
        }
        initGrid();

        ctx.font = `${FONT_SIZE}px 'Share Tech Mono', monospace`;
        ctx.textBaseline = "top";

        // Pre-draw the whole grid, then only redraw changed cells
        function drawCell(r: number, c: number) {
            const cell = grid[r][c];
            const x = c * CELL;
            const y = r * CELL;
            // clear
            ctx!.clearRect(x, y, CELL, CELL);
            ctx!.fillStyle = `rgba(6,182,212,${cell.bright})`;
            ctx!.fillText(cell.v.toString(), x, y);
        }

        function drawAll() {
            ctx!.clearRect(0, 0, w, h);
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = grid[r][c];
                    ctx!.fillStyle = `rgba(6,182,212,${cell.bright})`;
                    ctx!.fillText(cell.v.toString(), c * CELL, r * CELL);
                }
            }
        }

        drawAll();

        // Each tick: flip ~4% of cells and re-draw only those cells
        function tick() {
            const total = rows * cols;
            const flips = Math.floor(total * 0.04);
            for (let i = 0; i < flips; i++) {
                const r = Math.floor(Math.random() * rows);
                const c = Math.floor(Math.random() * cols);
                grid[r][c].v = grid[r][c].v === 0 ? 1 : 0;
                // Occasional brightness reshuffle for liveliness
                if (Math.random() > 0.85) {
                    grid[r][c].bright = Math.random() * 0.55 + 0.05;
                }
                drawCell(r, c);
            }
        }

        const interval = setInterval(tick, 60);

        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            cols = Math.ceil(w / CELL);
            rows = Math.ceil(h / CELL);
            ctx.font = `${FONT_SIZE}px 'Share Tech Mono', monospace`;
            ctx.textBaseline = "top";
            initGrid();
            drawAll();
        };
        window.addEventListener("resize", onResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}

/** ── Splash screen ────────────────────────────────────────── */
const TITLE = "JOB APPLICATION MANAGER";

export function SplashScreen({ onDone }: { onDone: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const DURATION = 2400;
        const start = performance.now();
        let raf: number;
        const tick = (now: number) => {
            const pct = Math.min((now - start) / DURATION, 1);
            setProgress(pct);
            if (pct < 1) raf = requestAnimationFrame(tick);
            else setTimeout(onDone, 300);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [onDone]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "#020c1b" }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
        >
            {/* Live scramble fill */}
            <DigitalScramble />

            {/* Radial vignette — fades grid toward centre so UI pops */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 48% 48% at 50% 50%, rgba(2,12,27,0.82) 0%, rgba(2,12,27,0.25) 100%)",
                }}
            />

            {/* ── Foreground ── */}
            <div className="relative flex flex-col items-center">
                {[120, 80, 50].map((r, i) => (
                    <motion.div
                        key={r}
                        className="absolute rounded-full border"
                        style={{ width: r * 2, height: r * 2, borderColor: "rgba(6,182,212,0.14)" }}
                        animate={{ scale: [1, 1.07, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}

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
                    <motion.div
                        className="absolute inset-[-8px] rounded-2xl"
                        style={{
                            border: "1px solid transparent",
                            borderTopColor: "rgba(6,182,212,0.7)",
                            borderRightColor: "rgba(6,182,212,0.2)",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <Briefcase className="h-9 w-9" style={{ color: "#06b6d4" }} />
                </motion.div>

                <div
                    className="mb-2 flex gap-[2px]"
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

                <motion.p
                    className="mb-10 text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: "rgba(6,182,212,0.55)", fontFamily: "var(--font-mono)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                >
                    Initializing system
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>_</motion.span>
                </motion.p>

                <div
                    className="relative h-px w-56 overflow-hidden rounded-full"
                    style={{ background: "rgba(6,182,212,0.12)" }}
                >
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                            background: "linear-gradient(90deg, rgba(6,182,212,0.4), #06b6d4)",
                            boxShadow: "0 0 8px rgba(6,182,212,0.7)",
                        }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.05 }}
                    />
                </div>

                <motion.p
                    className="mt-2 text-[0.65rem] font-bold"
                    style={{ color: "rgba(6,182,212,0.35)", fontFamily: "var(--font-mono)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {Math.round(progress * 100)}%
                </motion.p>
            </div>
        </motion.div>
    );
}
