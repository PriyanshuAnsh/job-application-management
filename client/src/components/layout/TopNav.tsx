type RouteKey = "applications" | "analytics";

type TopNavProps = {
    route: RouteKey;
};

const TABS: { key: RouteKey; label: string; href: string }[] = [
    { key: "applications", label: "Applications", href: "#/applications" },
    { key: "analytics", label: "Analytics", href: "#/analytics" },
];

export function TopNav({ route }: TopNavProps) {
    return (
        <nav className="top-nav" aria-label="Main navigation">
            {TABS.map((tab) => (
                <a
                    key={tab.key}
                    href={tab.href}
                    className={`nav-link${route === tab.key ? " nav-link--active" : ""}`}
                    aria-current={route === tab.key ? "page" : undefined}
                >
                    {tab.label}
                </a>
            ))}
        </nav>
    );
}
