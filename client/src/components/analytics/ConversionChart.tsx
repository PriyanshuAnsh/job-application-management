import {
    Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { EmptyState } from "../ui/EmptyState";

type FlowEntry = { stage: string; count: number };

const TOOLTIP_STYLE = {
    background: "#1e293b",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
};

const TICK = { fill: "#64748b", fontSize: 11 };
const BAR_COLORS = ["#6366f1", "#f59e0b", "#10b981"];

type ConversionChartProps = {
    data: FlowEntry[];
};

export function ConversionChart({ data }: ConversionChartProps) {
    const hasData = data.some((d) => d.count > 0);

    return (
        <article className="chart-card">
            <h2 className="chart-card__title">Conversion Flow</h2>
            <p className="chart-card__sub">From applications to interviews and offers.</p>
            {hasData ? (
                <div className="chart-wrap" role="img" aria-label="Bar chart of application conversion">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.08)" vertical={false} />
                            <XAxis dataKey="stage" tick={TICK} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
                                {data.map((entry, i) => (
                                    <Cell key={entry.stage} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.9} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <EmptyState />
            )}
        </article>
    );
}
