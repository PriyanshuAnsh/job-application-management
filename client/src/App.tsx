import { useEffect, useState } from "react";
import { ToastProvider } from "./context/ToastContext";
import { useApplicationData } from "./hooks/useApplicationData";
import { Header } from "./components/layout/Header";
import { TopNav } from "./components/layout/TopNav";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";

type RouteKey = "applications" | "analytics";

function routeFromHash(hash: string): RouteKey {
  return hash === "#/analytics" ? "analytics" : "applications";
}

function AppContent() {
  const [route, setRoute] = useState<RouteKey>(() => routeFromHash(window.location.hash));
  const data = useApplicationData();

  useEffect(() => {
    if (!window.location.hash) window.location.hash = "#/applications";
    const onHashChange = () => setRoute(routeFromHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <main className="layout">
      <Header />
      <TopNav route={route} />

      {route === "applications" ? (
        <ApplicationsPage
          applications={data.applications}
          stats={data.stats}
          loading={data.loading}
          onCreate={data.handleCreate}
          onStatusChange={data.handleStatusChange}
          onDelete={data.handleDelete}
          onUpdate={data.handleUpdate}
        />
      ) : (
        <AnalyticsPage
          applications={data.applications}
          stats={data.stats}
          loading={data.loading}
          error={null}
        />
      )}
    </main>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
