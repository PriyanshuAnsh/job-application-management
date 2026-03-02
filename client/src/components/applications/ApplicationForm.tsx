import { FormEvent, useState } from "react";
import { applicationStatuses } from "../../types/application";
import type { CreateApplicationPayload, JobApplication } from "../../types/application";

type ApplicationFormProps = {
    onCreate: (payload: CreateApplicationPayload) => Promise<void>;
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
    appliedDate: new Date().toISOString().slice(0, 10),
};

export function ApplicationForm({ onCreate }: ApplicationFormProps) {
    const [form, setForm] = useState<CreateApplicationPayload>(defaultForm);
    const [submitting, setSubmitting] = useState(false);

    function set<K extends keyof CreateApplicationPayload>(key: K, value: CreateApplicationPayload[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onCreate(form);
            setForm(defaultForm);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="panel">
            <div className="panel__header">
                <h2>Add Application</h2>
                <p>Capture each opportunity as soon as you find it.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
                <label className="field">
                    <span className="field__label">Company</span>
                    <input required placeholder="Acme Corp" value={form.company} onChange={(e) => set("company", e.target.value)} />
                </label>

                <label className="field">
                    <span className="field__label">Role</span>
                    <input required placeholder="Software Engineer" value={form.role} onChange={(e) => set("role", e.target.value)} />
                </label>

                <label className="field">
                    <span className="field__label">Location</span>
                    <input required placeholder="Remote / New York" value={form.location} onChange={(e) => set("location", e.target.value)} />
                </label>

                <label className="field">
                    <span className="field__label">Status</span>
                    <select value={form.status} onChange={(e) => set("status", e.target.value as JobApplication["status"])}>
                        {applicationStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </label>

                <label className="field">
                    <span className="field__label">Applied Date</span>
                    <input type="date" value={form.appliedDate} onChange={(e) => set("appliedDate", e.target.value)} />
                </label>

                <label className="field">
                    <span className="field__label">Job URL <span className="field__optional">(optional)</span></span>
                    <input type="url" placeholder="https://..." value={form.jobUrl ?? ""} onChange={(e) => set("jobUrl", e.target.value.trim() || null)} />
                </label>

                <label className="field">
                    <span className="field__label">Salary Min <span className="field__optional">(optional)</span></span>
                    <input type="number" min="0" placeholder="80000" value={form.salaryMin ?? ""} onChange={(e) => set("salaryMin", e.target.value ? Number(e.target.value) : null)} />
                </label>

                <label className="field">
                    <span className="field__label">Salary Max <span className="field__optional">(optional)</span></span>
                    <input type="number" min="0" placeholder="120000" value={form.salaryMax ?? ""} onChange={(e) => set("salaryMax", e.target.value ? Number(e.target.value) : null)} />
                </label>

                <label className="field field--full">
                    <span className="field__label">Notes <span className="field__optional">(optional)</span></span>
                    <textarea rows={3} placeholder="Recruiter name, referral, interview rounds…" value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value.trim() || null)} />
                </label>

                <div className="form-actions">
                    <button type="submit" className="btn btn--primary" disabled={submitting}>
                        {submitting ? "Saving…" : "Save Application"}
                    </button>
                </div>
            </form>
        </section>
    );
}
