import { Badge } from "@/components/ui/badge";
import type { JobApplication } from "@/types/application";

const variantMap: Record<JobApplication["status"], string> = {
    Wishlist: "jarvis-badge-wishlist",
    Applied: "jarvis-badge-applied",
    Interview: "jarvis-badge-interview",
    Offer: "jarvis-badge-offer",
    Rejected: "jarvis-badge-rejected",
};

type StatusBadgeProps = {
    status: JobApplication["status"];
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <Badge
            className={`${variantMap[status]} rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest border`}
            style={{ fontFamily: "var(--font-display)" }}
        >
            {status}
        </Badge>
    );
}
