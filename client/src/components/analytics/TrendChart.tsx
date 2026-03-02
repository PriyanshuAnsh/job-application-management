import {
    Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { EmptyState } from "../ui/EmptyState";

type TrendEntry = { month: string; applications: number };

const TOOLTIP_STYLE = {
    background: "#1e293b",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
};

const TICK = { fill: "#64748b", fontSize: 11 };

type TrendChartProps = {
    data: TrendEntry[];
};

export function TrendChart({ data }: TrendChartProps) {
    const hasData = data.some((d) => d.applications > 0);

    return (
        <article className="chart-card">
            <h2 className="chart-card__title">Application Trend</h2>
            <p className="chart-card__sub">Applications submitted in the last 8 months.</p>
            {hasData ? (
                <div className="chart-wrap" role="img" aria-label="Area chart of monthly application count">
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.08)" />
                            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Area
                                type="monotone"
                                dataKey="applications"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                fill="url(#trendGrad)"
                                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <EmptyState />
            )}
        </article>
    );
}
