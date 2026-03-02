import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { ToastProvider } from "./context/ToastContext";
import { useApplicationData } from "./hooks/useApplicationData";
import { Header } from "./components/layout/Header";
import { TopNav } from "./components/layout/TopNav";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SplashScreen } from "./components/ui/SplashScreen";

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
    <div className="jarvis-layout">
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
    </div>
  );
}

export function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {!splashDone && (
          <SplashScreen key="splash" onDone={handleSplashDone} />
        )}
      </AnimatePresence>

      <AppContent />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--jarvis-surface-2)",
            border: "1px solid var(--jarvis-cyan-border)",
            color: "var(--jarvis-text)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.875rem",
          },
        }}
      />
    </ToastProvider>
  );
}
