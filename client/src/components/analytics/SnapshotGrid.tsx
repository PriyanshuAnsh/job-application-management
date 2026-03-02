import type { Stats } from "../../types/stats";

type SnapshotGridProps = {
    stats: Stats | null;
};

export function SnapshotGrid({ stats }: SnapshotGridProps) {
    const items = [
        { label: "Total Tracked", value: stats?.total ?? 0 },
        { label: "Wishlist", value: stats?.wishlist ?? 0 },
        { label: "In Interview", value: stats?.interviewing ?? 0 },
        { label: "Rejected", value: stats?.rejected ?? 0 },
    ];

    return (
        <section className="panel">
            <div className="panel__header">
                <h2>Snapshot</h2>
                <p>Real-time KPI snapshot from your current pipeline status.</p>
            </div>
            <div className="snapshot-grid">
                {items.map((item) => (
                    <div key={item.label} className="snapshot-item">
                        <p className="snapshot-item__label">{item.label}</p>
                        <p className="snapshot-item__value">{item.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
