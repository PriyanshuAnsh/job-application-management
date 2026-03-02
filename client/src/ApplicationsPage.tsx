import { FormEvent, useMemo, useState } from "react";
import { CreateApplicationPayload, JobApplication, Stats, statuses } from "./types";

type ApplicationsPageProps = {
  applications: JobApplication[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  onCreate: (payload: CreateApplicationPayload) => Promise<void>;
  onStatusChange: (id: string, nextStatus: JobApplication["status"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const defaultForm: CreateApplicationPayload = {
  company: "",
  role: "",
  status: "Wishlist",
  location: "",
  salaryMin: null,
  salaryMax: null,
  jobUrl: null,
  notes: null,
  appliedDate: new Date().toISOString().slice(0, 10)
};

export function ApplicationsPage({
  applications,
  stats,
  loading,
  error,
  onCreate,
  onStatusChange,
  onDelete
}: ApplicationsPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CreateApplicationPayload>(defaultForm);

  const cards = useMemo(
    () => [
      { label: "Total", value: stats?.total ?? 0 },
      { label: "Applied", value: stats?.applied ?? 0 },
      { label: "Interview", value: stats?.interviewing ?? 0 },
      { label: "Offers", value: stats?.offers ?? 0 }
    ],
    [stats]
  );

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (statusFilter !== "All" && application.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        application.company.toLowerCase().includes(query) ||
        application.role.toLowerCase().includes(query) ||
        application.location.toLowerCase().includes(query)
      );
    });
  }, [applications, search, statusFilter]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreate(form);
    setForm(defaultForm);
  }

  async function handleDelete(applicationId: string) {
    const confirmed = window.confirm("Delete this application?");
    if (!confirmed) {
      return;
    }

    await onDelete(applicationId);
  }

  return (
    <>
      {error ? <p className="error">{error}</p> : null}

      <section className="cards">
        {cards.map((card, index) => (
          <article key={card.label} className="card" style={{ animationDelay: `${index * 70}ms` }}>
            <h2>{card.label}</h2>
            <p>{card.value}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Add Application</h2>
          <p>Capture each opportunity as soon as you find it.</p>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Company
            <input
              required
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            />
          </label>
          <label>
            Role
            <input
              required
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            />
          </label>
          <label>
            Location
            <input
              required
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as JobApplication["status"] }))
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Applied Date
            <input
              type="date"
              value={form.appliedDate}
              onChange={(event) => setForm((prev) => ({ ...prev, appliedDate: event.target.value }))}
            />
          </label>
          <label>
            Job URL (Optional)
            <input
              type="url"
              value={form.jobUrl ?? ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, jobUrl: event.target.value.trim() || null }))
              }
              placeholder="https://..."
            />
          </label>
          <label>
            Salary Min
            <input
              type="number"
              min="0"
              value={form.salaryMin ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  salaryMin: event.target.value ? Number(event.target.value) : null
                }))
              }
            />
          </label>
          <label>
            Salary Max
            <input
              type="number"
              min="0"
              value={form.salaryMax ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  salaryMax: event.target.value ? Number(event.target.value) : null
                }))
              }
            />
          </label>
          <label className="full-width">
            Notes
            <textarea
              rows={3}
              value={form.notes ?? ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, notes: event.target.value.trim() || null }))
              }
            />
          </label>
          <button type="submit" className="primary-action">
            Save Application
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="filters">
          <h2>Pipeline</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company, role, location"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? <p>Loading...</p> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6}>No applications match this filter.</td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.company}</td>
                    <td>{application.role}</td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-pill status-${application.status.toLowerCase()}`}>
                          {application.status}
                        </span>
                        <select
                          value={application.status}
                          onChange={(event) =>
                            onStatusChange(application.id, event.target.value as JobApplication["status"])
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>{application.location}</td>
                    <td>{application.appliedDate}</td>
                    <td>
                      <div className="actions">
                        {application.jobUrl ? (
                          <a href={application.jobUrl} target="_blank" rel="noreferrer">
                            Job
                          </a>
                        ) : null}
                        <button type="button" onClick={() => handleDelete(application.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
