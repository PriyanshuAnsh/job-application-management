type EmptyStateProps = {
    message?: string;
};

export function EmptyState({ message = "Add applications to populate this chart." }: EmptyStateProps) {
    return (
        <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                <path d="M13 20h14M20 13v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>{message}</p>
        </div>
    );
}
