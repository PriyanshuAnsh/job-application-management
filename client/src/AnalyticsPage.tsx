import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { JobApplication, Stats, statuses } from "./types";

type AnalyticsPageProps = {
  applications: JobApplication[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
};

const statusColorMap: Record<JobApplication["status"], string> = {
  Wishlist: "#8d8d8d",
  Applied: "#cc0000",
  Interview: "#e03a3e",
  Offer: "#7d0f12",
  Rejected: "#2c2c2c"
};

function percentage(numerator: number, denominator: number) {
  if (denominator === 0) {
    return "0.0";
  }

  return ((numerator / denominator) * 100).toFixed(1);
}

function monthKey(dateValue: string) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key: string) {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
}

function getRecentMonthKeys(monthCount: number) {
  const keys: string[] = [];
  const now = new Date();

  for (let i = monthCount - 1; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`);
  }

  return keys;
}

export function AnalyticsPage({ applications, stats, loading, error }: AnalyticsPageProps) {
  const statusBreakdown = useMemo(() => {
    const total = applications.length;

    return statuses.map((status) => {
      const value = applications.filter((application) => application.status === status).length;
      return {
        name: status,
        value,
        share: percentage(value, total),
        color: statusColorMap[status]
      };
    });
  }, [applications]);

  const monthlyTrend = useMemo(() => {
    const keys = getRecentMonthKeys(8);
    const counts = applications.reduce<Record<string, number>>((acc, app) => {
      const key = monthKey(app.appliedDate);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return keys.map((key) => ({
      month: formatMonth(key),
      applications: counts[key] ?? 0
    }));
  }, [applications]);

  const conversionFlow = useMemo(() => {
    const appliedOrBeyond = applications.filter((application) => application.status !== "Wishlist").length;
    const interviewsOrBeyond = applications.filter(
      (application) => application.status === "Interview" || application.status === "Offer"
    ).length;
    const offers = applications.filter((application) => application.status === "Offer").length;

    return [
      { stage: "Applied", count: appliedOrBeyond },
      { stage: "Interview", count: interviewsOrBeyond },
      { stage: "Offer", count: offers }
    ];
  }, [applications]);

  const advancedMetrics = useMemo(() => {
    const nonWishlist = applications.filter((application) => application.status !== "Wishlist").length;
    const interviewOrOffer = applications.filter(
      (application) => application.status === "Interview" || application.status === "Offer"
    ).length;
    const offers = applications.filter((application) => application.status === "Offer").length;
    const rejected = applications.filter((application) => application.status === "Rejected").length;

    const salaryMidpoints = applications
      .map((application) => {
        if (application.salaryMin !== null && application.salaryMax !== null) {
          return (application.salaryMin + application.salaryMax) / 2;
        }

        if (application.salaryMin !== null) {
          return application.salaryMin;
        }

        if (application.salaryMax !== null) {
          return application.salaryMax;
        }

        return null;
      })
      .filter((value): value is number => value !== null);

    const avgSalary =
      salaryMidpoints.length > 0
        ? Math.round(salaryMidpoints.reduce((sum, value) => sum + value, 0) / salaryMidpoints.length)
        : null;

    return {
      responseRate: percentage(interviewOrOffer + rejected, nonWishlist),
      interviewRate: percentage(interviewOrOffer, nonWishlist),
      offerRate: percentage(offers, nonWishlist),
      avgSalary
    };
  }, [applications]);

  const hasApplications = applications.length > 0;

  return (
    <>
      {error ? <p className="error">{error}</p> : null}

      <section className="cards">
        <article className="card">
          <h2>Response Rate</h2>
          <p>{advancedMetrics.responseRate}%</p>
        </article>
        <article className="card">
          <h2>Interview Rate</h2>
          <p>{advancedMetrics.interviewRate}%</p>
        </article>
        <article className="card">
          <h2>Offer Rate</h2>
          <p>{advancedMetrics.offerRate}%</p>
        </article>
        <article className="card">
          <h2>Avg Salary</h2>
          <p>{advancedMetrics.avgSalary ? `$${advancedMetrics.avgSalary.toLocaleString()}` : "N/A"}</p>
        </article>
      </section>

      <section className="panel analytics-grid">
        <article className="analytics-card chart-card">
          <h2>Status Distribution</h2>
          <p className="chart-subtitle">Pipeline split by current stage.</p>
          {hasApplications ? (
            <div className="chart-wrap" role="img" aria-label="Pie chart of application status distribution">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                    {statusBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-copy">Add applications to populate this chart.</p>
          )}
        </article>

        <article className="analytics-card chart-card">
          <h2>Application Trend</h2>
          <p className="chart-subtitle">New applications in the last 8 months.</p>
          {hasApplications ? (
            <div className="chart-wrap" role="img" aria-label="Line chart of monthly application count">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e4e4e4" />
                  <XAxis dataKey="month" tick={{ fill: "#2c2c2c", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#2c2c2c", fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#cc0000"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-copy">Add applications to populate this chart.</p>
          )}
        </article>

        <article className="analytics-card chart-card">
          <h2>Conversion Flow</h2>
          <p className="chart-subtitle">From applications to interviews and offers.</p>
          {hasApplications ? (
            <div className="chart-wrap" role="img" aria-label="Bar chart of conversion flow">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={conversionFlow} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e4e4e4" />
                  <XAxis dataKey="stage" tick={{ fill: "#2c2c2c", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#2c2c2c", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#cc0000" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-copy">Add applications to populate this chart.</p>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Snapshot</h2>
          <p>Real-time KPI snapshot from your current pipeline status.</p>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="snapshot-grid">
            <div>
              <h3>Total Tracked</h3>
              <p>{stats?.total ?? 0}</p>
            </div>
            <div>
              <h3>Wishlist</h3>
              <p>{stats?.wishlist ?? 0}</p>
            </div>
            <div>
              <h3>Rejected</h3>
              <p>{stats?.rejected ?? 0}</p>
            </div>
            <div>
              <h3>In Interview</h3>
              <p>{stats?.interviewing ?? 0}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
