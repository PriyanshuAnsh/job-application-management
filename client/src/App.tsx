import { useEffect, useState } from "react";
import {
  createApplication,
  deleteApplication,
  getApplications,
  getStats,
  updateApplication
} from "./api";
import { AnalyticsPage } from "./AnalyticsPage";
import { ApplicationsPage } from "./ApplicationsPage";
import { CreateApplicationPayload, JobApplication, Stats } from "./types";

type RouteKey = "applications" | "analytics";

function routeFromHash(hash: string): RouteKey {
  if (hash === "#/analytics") {
    return "analytics";
  }

  return "applications";
}

export function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteKey>(() => routeFromHash(window.location.hash));

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#/applications";
    }

    function onHashChange() {
      setRoute(routeFromHash(window.location.hash));
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  async function refreshData() {
    setLoading(true);
    setError(null);

    try {
      const [allApplications, appStats] = await Promise.all([
        getApplications({ status: "All", search: "" }),
        getStats()
      ]);

      setApplications(allApplications);
      setStats(appStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshData();
  }, []);

  async function handleCreate(payload: CreateApplicationPayload) {
    setError(null);

    try {
      await createApplication(payload);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save application");
    }
  }

  async function handleStatusChange(id: string, nextStatus: JobApplication["status"]) {
    setError(null);

    try {
      await updateApplication(id, { status: nextStatus });
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    setError(null);

    try {
      await deleteApplication(id);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete application");
    }
  }

  return (
    <main className="layout">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="hero">
        <p className="eyebrow">Career OS</p>
        <h1>Job Application Manager</h1>
        <p>Track roles, outcomes, and pipeline progress in one focused command center.</p>
      </header>

      <nav className="top-nav">
        <a href="#/applications" className={route === "applications" ? "nav-link active" : "nav-link"}>
          Applications
        </a>
        <a href="#/analytics" className={route === "analytics" ? "nav-link active" : "nav-link"}>
          Analytics
        </a>
      </nav>

      {route === "applications" ? (
        <ApplicationsPage
          applications={applications}
          stats={stats}
          loading={loading}
          error={error}
          onCreate={handleCreate}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <AnalyticsPage applications={applications} stats={stats} loading={loading} error={error} />
      )}
    </main>
  );
}
