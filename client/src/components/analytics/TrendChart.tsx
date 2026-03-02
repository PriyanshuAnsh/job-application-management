import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type TrendChartProps = {
    data: { month: string; count: number }[];
};

export function TrendChart({ data }: TrendChartProps) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="jarvis-trend-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" vertical={false} />
                <XAxis
                    dataKey="month"
                    tick={{ fill: "rgba(6,182,212,0.4)", fontSize: 11, fontFamily: "var(--font-display)" }}
                    axisLine={false} tickLine={false}
                />
                <YAxis
                    tick={{ fill: "rgba(6,182,212,0.4)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                    axisLine={false} tickLine={false} allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{
                        background: "var(--jarvis-surface-2)",
                        border: "1px solid var(--jarvis-cyan-border)",
                        borderRadius: "0.5rem",
                        color: "var(--jarvis-text)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.85rem",
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#jarvis-trend-fill)"
                    dot={{ fill: "#06b6d4", strokeWidth: 0, r: 3 }}
                    activeDot={{ fill: "#38bdf8", r: 5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
