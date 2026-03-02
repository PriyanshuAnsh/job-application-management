const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? "Request failed");
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
}
