import { request } from "./client";
import type { Stats } from "../../types/stats";

export function getStats() {
    return request<Stats>("/api/stats");
}
