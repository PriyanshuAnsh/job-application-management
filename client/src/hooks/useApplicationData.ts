import { useCallback, useEffect, useState } from "react";
import {
    createApplication,
    deleteApplication,
    getApplications,
    updateApplication,
} from "../lib/api/applications";
import { getStats } from "../lib/api/stats";
import { useToast } from "../context/ToastContext";
import type { CreateApplicationPayload, JobApplication } from "../types/application";
import type { Stats } from "../types/stats";

export function useApplicationData() {
    const { addToast } = useToast();
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
            addToast("error", err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        void refreshData();
    }, [refreshData]);

    const handleCreate = useCallback(
        async (payload: CreateApplicationPayload) => {
            try {
                await createApplication(payload);
                await refreshData();
                addToast("success", `Application at ${payload.company} saved!`);
            } catch (err) {
                addToast("error", err instanceof Error ? err.message : "Failed to save application");
                throw err; // re-throw so the form knows about it
            }
        },
        [refreshData, addToast]
    );

    const handleUpdate = useCallback(
        async (id: string, payload: Partial<CreateApplicationPayload>) => {
            try {
                await updateApplication(id, payload);
                await refreshData();
                addToast("success", "Application updated");
            } catch (err) {
                addToast("error", err instanceof Error ? err.message : "Failed to update application");
                throw err;
            }
        },
        [refreshData, addToast]
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
                addToast("success", `Deleted "${company}"`);
            } catch (err) {
                addToast("error", err instanceof Error ? err.message : "Failed to delete application");
                throw err;
            }
        },
        [refreshData, addToast]
    );

    return {
        applications,
        stats,
        loading,
        handleCreate,
        handleUpdate,
        handleStatusChange,
        handleDelete,
    };
}
