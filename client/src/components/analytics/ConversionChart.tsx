import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

type ConversionChartProps = {
    data: { stage: string; count: number }[];
};

const STAGE_COLORS: Record<string, string> = {
    Applied: "#06b6d4",
    Interview: "#f59e0b",
    Offer: "#10b981",
};

export function ConversionChart({ data }: ConversionChartProps) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    {Object.entries(STAGE_COLORS).map(([stage, color]) => (
                        <linearGradient key={stage} id={`bar-${stage}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" vertical={false} />
                <XAxis
                    dataKey="stage"
                    tick={{ fill: "rgba(6,182,212,0.5)", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700 }}
                    axisLine={false} tickLine={false}
                />
                <YAxis
                    tick={{ fill: "rgba(6,182,212,0.4)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={false} tickLine={false} allowDecimals={false}
                />
                <Tooltip
                    cursor={{ fill: "rgba(6,182,212,0.05)" }}
                    contentStyle={{
                        background: "var(--jarvis-surface-2)",
                        border: "1px solid var(--jarvis-cyan-border)",
                        borderRadius: "0.5rem",
                        color: "var(--jarvis-text)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.85rem",
                    }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.map((entry) => (
                        <Cell
                            key={entry.stage}
                            fill={`url(#bar-${entry.stage})`}
                            stroke={STAGE_COLORS[entry.stage] ?? "rgba(6,182,212,0.3)"}
                            strokeWidth={1}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
