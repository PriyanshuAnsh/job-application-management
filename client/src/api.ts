import { CreateApplicationPayload, JobApplication, Stats } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getApplications(filters: { status: string; search: string }) {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== "All") {
    params.set("status", filters.status);
  }

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  return request<JobApplication[]>(`/api/applications?${params.toString()}`);
}

export function getStats() {
  return request<Stats>("/api/stats");
}

export function createApplication(payload: CreateApplicationPayload) {
  return request<JobApplication>("/api/applications", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateApplication(id: string, payload: Partial<CreateApplicationPayload>) {
  return request<JobApplication>(`/api/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteApplication(id: string) {
  return request<void>(`/api/applications/${id}`, {
    method: "DELETE"
  });
}
