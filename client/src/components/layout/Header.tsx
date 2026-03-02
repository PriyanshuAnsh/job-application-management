export function Header() {
    return (
        <header className="hero">
            <div className="hero__inner">
                <div className="hero__text">
                    <p className="eyebrow">Career OS</p>
                    <h1>Job Application Manager</h1>
                    <p className="hero__sub">Track roles, outcomes, and pipeline progress in one focused command center.</p>
                </div>
                <div className="hero__badge" aria-hidden="true">
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <rect width="52" height="52" rx="14" fill="rgba(99,102,241,0.15)" />
                        <path d="M16 20a4 4 0 014-4h12a4 4 0 014 4v14a2 2 0 01-2 2H18a2 2 0 01-2-2V20z" stroke="#818cf8" strokeWidth="1.75" strokeLinejoin="round" />
                        <path d="M22 16v-2a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#818cf8" strokeWidth="1.75" strokeLinejoin="round" />
                        <path d="M20 27h12M20 31h8" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </header>
    );
}
