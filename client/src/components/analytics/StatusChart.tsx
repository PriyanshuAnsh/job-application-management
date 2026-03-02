import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS: Record<string, string> = {
    Wishlist: "#8b5cf6",
    Applied: "#06b6d4",
    Interview: "#f59e0b",
    Offer: "#10b981",
    Rejected: "#475569",
};

type StatusChartProps = {
    data: { name: string; value: number }[];
};

function CustomLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
            <tspan
                x={cx} dy="-0.4em"
                style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", fontWeight: 600, fill: "#06b6d4" }}
            >
                {total}
            </tspan>
            <tspan
                x={cx} dy="1.5em"
                style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.12em", fill: "rgba(6,182,212,0.5)", textTransform: "uppercase" }}
            >
                TOTAL
            </tspan>
        </text>
    );
}

export function StatusChart({ data }: StatusChartProps) {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%" cy="50%"
                    innerRadius={75} outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={false}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.name}
                            fill={COLORS[entry.name] ?? "#334155"}
                            stroke="rgba(6,182,212,0.15)"
                            strokeWidth={1}
                        />
                    ))}
                </Pie>
                {total > 0 && <CustomLabel cx={0} cy={0} total={total} />}
                <Tooltip
                    cursor={false}
                    contentStyle={{
                        background: "var(--jarvis-surface-2)",
                        border: "1px solid var(--jarvis-cyan-border)",
                        borderRadius: "0.5rem",
                        color: "var(--jarvis-text)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.85rem",
                    }}
                />
                <Legend
                    iconType="circle"
                    iconSize={7}
                    formatter={(value) => (
                        <span style={{ color: "var(--jarvis-text-dim)", fontFamily: "var(--font-display)", fontSize: "0.8rem" }}>
                            {value}
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
