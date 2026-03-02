import { request } from "./client";
import type { CreateApplicationPayload, JobApplication } from "../../types/application";

export function getApplications(filters: { status: string; search: string }) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "All") params.set("status", filters.status);
    if (filters.search.trim()) params.set("search", filters.search.trim());
    return request<JobApplication[]>(`/api/applications?${params.toString()}`);
}

export function getApplicationById(id: string) {
    return request<JobApplication>(`/api/applications/${id}`);
}

export function createApplication(payload: CreateApplicationPayload) {
    return request<JobApplication>("/api/applications", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateApplication(id: string, payload: Partial<CreateApplicationPayload>) {
    return request<JobApplication>(`/api/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteApplication(id: string) {
    return request<void>(`/api/applications/${id}`, { method: "DELETE" });
}
