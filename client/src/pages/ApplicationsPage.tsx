import type { CreateApplicationPayload, JobApplication } from "../types/application";
import type { Stats } from "../types/stats";
import { StatsCards } from "../components/applications/StatsCards";
import { ApplicationForm } from "../components/applications/ApplicationForm";
import { ApplicationTable } from "../components/applications/ApplicationTable";

type ApplicationsPageProps = {
    applications: JobApplication[];
    stats: Stats | null;
    loading: boolean;
    onCreate: (payload: CreateApplicationPayload) => Promise<void>;
    onStatusChange: (id: string, nextStatus: JobApplication["status"]) => Promise<void>;
    onDelete: (id: string, company: string) => Promise<void>;
    onUpdate: (id: string, payload: Partial<CreateApplicationPayload>) => Promise<void>;
};

export function ApplicationsPage({
    applications,
    stats,
    loading,
    onCreate,
    onStatusChange,
    onDelete,
    onUpdate,
}: ApplicationsPageProps) {
    return (
        <>
            <StatsCards stats={stats} />
            <ApplicationForm onCreate={onCreate} />
            <ApplicationTable
                applications={applications}
                loading={loading}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
        </>
    );
}
