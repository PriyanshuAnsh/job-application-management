import type { Stats } from "../../types/stats";

type MetricCardsProps = {
    stats: Stats | null;
    responseRate: string;
    interviewRate: string;
    offerRate: string;
    avgSalary: number | null;
};

export function MetricCards({ responseRate, interviewRate, offerRate, avgSalary }: MetricCardsProps) {
    const cards = [
        { label: "Response Rate", value: `${responseRate}%` },
        { label: "Interview Rate", value: `${interviewRate}%` },
        { label: "Offer Rate", value: `${offerRate}%` },
        { label: "Avg. Salary", value: avgSalary ? `$${avgSalary.toLocaleString()}` : "N/A" },
    ];

    return (
        <section className="stat-cards" aria-label="Analytics metrics">
            {cards.map((card, i) => (
                <article key={card.label} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
                    <p className="stat-card__label">{card.label}</p>
                    <p className="stat-card__value">{card.value}</p>
                </article>
            ))}
        </section>
    );
}
