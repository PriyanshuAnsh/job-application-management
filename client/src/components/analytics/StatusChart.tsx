import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "../ui/EmptyState";
import type { ApplicationStatus } from "../../types/application";

type Entry = { name: ApplicationStatus; value: number; color: string };

const TOOLTIP_STYLE = {
    background: "#1e293b",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
};

type StatusChartProps = {
    data: Entry[];
};

export function StatusChart({ data }: StatusChartProps) {
    const hasData = data.some((d) => d.value > 0);

    return (
        <article className="chart-card">
            <h2 className="chart-card__title">Status Distribution</h2>
            <p className="chart-card__sub">Pipeline split by current stage.</p>
            {hasData ? (
                <div className="chart-wrap" role="img" aria-label="Donut chart of status distribution">
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={68}
                                outerRadius={100}
                                paddingAngle={3}
                                strokeWidth={0}
                            >
                                {data.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <EmptyState />
            )}
        </article>
    );
}
