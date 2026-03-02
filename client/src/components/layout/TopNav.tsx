type TopNavProps = {
    route: "applications" | "analytics";
};

export function TopNav({ route }: TopNavProps) {
    return (
        <nav
            className="flex gap-1 p-1 w-fit rounded-lg"
            style={{
                background: "var(--jarvis-surface)",
                border: "1px solid var(--jarvis-cyan-border)",
            }}
        >
            {(
                [
                    { key: "applications", label: "Pipeline" },
                    { key: "analytics", label: "Analytics" },
                ] as const
            ).map(({ key, label }) => {
                const isActive = route === key;
                return (
                    <a
                        key={key}
                        href={`#/${key}`}
                        className="rounded px-5 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-200"
                        style={{
                            fontFamily: "var(--font-display)",
                            background: isActive ? "rgba(6,182,212,0.15)" : "transparent",
                            color: isActive ? "var(--jarvis-cyan)" : "var(--jarvis-text-dim)",
                            border: isActive ? "1px solid rgba(6,182,212,0.35)" : "1px solid transparent",
                            boxShadow: isActive ? "0 0 12px rgba(6,182,212,0.2)" : "none",
                            textShadow: isActive ? "0 0 8px rgba(6,182,212,0.5)" : "none",
                        }}
                    >
                        {label}
                    </a>
                );
            })}
        </nav>
    );
}
