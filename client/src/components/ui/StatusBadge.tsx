import type { ApplicationStatus } from "../../types/application";

const CONFIG: Record<ApplicationStatus, { label: string; cls: string }> = {
    Wishlist: { label: "Wishlist", cls: "badge--wishlist" },
    Applied: { label: "Applied", cls: "badge--applied" },
    Interview: { label: "Interview", cls: "badge--interview" },
    Offer: { label: "Offer", cls: "badge--offer" },
    Rejected: { label: "Rejected", cls: "badge--rejected" },
};

type StatusBadgeProps = {
    status: ApplicationStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { label, cls } = CONFIG[status];
    return <span className={`badge ${cls}`}>{label}</span>;
}
