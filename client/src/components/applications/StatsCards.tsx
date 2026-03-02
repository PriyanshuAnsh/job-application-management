import { useMemo } from "react";
import type { Stats } from "../../types/stats";

type StatsCardsProps = {
    stats: Stats | null;
};

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = useMemo(
        () => [
            { label: "Total", value: stats?.total ?? 0, accent: false },
            { label: "Applied", value: stats?.applied ?? 0, accent: false },
            { label: "Interview", value: stats?.interviewing ?? 0, accent: true },
            { label: "Offers", value: stats?.offers ?? 0, accent: false },
        ],
        [stats]
    );

    return (
        <section className="stat-cards" aria-label="Application statistics">
            {cards.map((card, i) => (
                <article key={card.label} className={`stat-card${card.accent ? " stat-card--accent" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                    <p className="stat-card__label">{card.label}</p>
                    <p className="stat-card__value">{card.value}</p>
                </article>
            ))}
        </section>
    );
}
