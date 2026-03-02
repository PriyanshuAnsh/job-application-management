import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    createApplication,
    deleteApplication,
    getApplications,
    updateApplication,
} from "@/lib/api/applications";
import { getStats } from "@/lib/api/stats";
import type { CreateApplicationPayload, JobApplication } from "@/types/application";
import type { Stats } from "@/types/stats";

export function useApplicationData() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const [apps, appStats] = await Promise.all([
                getApplications({ status: "All", search: "" }),
                getStats(),
            ]);
            setApplications(apps);
            setStats(appStats);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshData();
    }, [refreshData]);

    const handleCreate = useCallback(
        async (payload: CreateApplicationPayload) => {
            try {
                await createApplication(payload);
                await refreshData();
                toast.success(`Application at ${payload.company} saved!`);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to save application");
                throw err;
            }
        },
        [refreshData]
    );

    const handleUpdate = useCallback(
        async (id: string, payload: Partial<CreateApplicationPayload>) => {
            try {
                await updateApplication(id, payload);
                await refreshData();
                toast.success("Application updated");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to update");
                throw err;
            }
        },
        [refreshData]
    );

    const handleStatusChange = useCallback(
        async (id: string, nextStatus: JobApplication["status"]) => {
            await handleUpdate(id, { status: nextStatus });
        },
        [handleUpdate]
    );

    const handleDelete = useCallback(
        async (id: string, company: string) => {
            try {
                await deleteApplication(id);
                await refreshData();
                toast.success(`Deleted "${company}"`);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to delete");
                throw err;
            }
        },
        [refreshData]
    );

    return { applications, stats, loading, handleCreate, handleUpdate, handleStatusChange, handleDelete };
}
