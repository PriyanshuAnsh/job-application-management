import { FormEvent, useEffect, useState } from "react";
import { applicationStatuses } from "../../types/application";
import type { CreateApplicationPayload, JobApplication } from "../../types/application";
import { Drawer } from "../ui/Drawer";

type EditApplicationDrawerProps = {
    application: JobApplication | null;
    open: boolean;
    onClose: () => void;
    onUpdate: (id: string, payload: Partial<CreateApplicationPayload>) => Promise<void>;
};

export function EditApplicationDrawer({
    application,
    open,
    onClose,
    onUpdate,
}: EditApplicationDrawerProps) {
    const [form, setForm] = useState<Partial<CreateApplicationPayload>>({});
    const [submitting, setSubmitting] = useState(false);

    // Sync form when application changes
    useEffect(() => {
        if (application) {
            setForm({
                company: application.company,
                role: application.role,
                status: application.status,
                location: application.location,
                salaryMin: application.salaryMin,
                salaryMax: application.salaryMax,
                jobUrl: application.jobUrl,
                notes: application.notes,
                appliedDate: application.appliedDate,
            });
        }
    }, [application]);

    function set<K extends keyof CreateApplicationPayload>(key: K, value: CreateApplicationPayload[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!application) return;
        setSubmitting(true);
        try {
            await onUpdate(application.id, form);
            onClose();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Drawer open={open} onClose={onClose} title="Edit Application">
            {application && (
                <form onSubmit={handleSubmit} className="edit-form">
                    <label className="field">
                        <span className="field__label">Company</span>
                        <input required value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} />
                    </label>

                    <label className="field">
                        <span className="field__label">Role</span>
                        <input required value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} />
                    </label>

                    <label className="field">
                        <span className="field__label">Location</span>
                        <input required value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} />
                    </label>

                    <label className="field">
                        <span className="field__label">Status</span>
                        <select
                            value={form.status ?? "Wishlist"}
                            onChange={(e) => set("status", e.target.value as JobApplication["status"])}
                        >
                            {applicationStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </label>

                    <label className="field">
                        <span className="field__label">Applied Date</span>
                        <input type="date" value={form.appliedDate ?? ""} onChange={(e) => set("appliedDate", e.target.value)} />
                    </label>

                    <label className="field">
                        <span className="field__label">Job URL <span className="field__optional">(optional)</span></span>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={form.jobUrl ?? ""}
                            onChange={(e) => set("jobUrl", e.target.value.trim() || null)}
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">Salary Min <span className="field__optional">(optional)</span></span>
                        <input
                            type="number"
                            min="0"
                            placeholder="80000"
                            value={form.salaryMin ?? ""}
                            onChange={(e) => set("salaryMin", e.target.value ? Number(e.target.value) : null)}
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">Salary Max <span className="field__optional">(optional)</span></span>
                        <input
                            type="number"
                            min="0"
                            placeholder="120000"
                            value={form.salaryMax ?? ""}
                            onChange={(e) => set("salaryMax", e.target.value ? Number(e.target.value) : null)}
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">Notes <span className="field__optional">(optional)</span></span>
                        <textarea
                            rows={4}
                            placeholder="Recruiter name, referral, interview rounds…"
                            value={form.notes ?? ""}
                            onChange={(e) => set("notes", e.target.value.trim() || null)}
                        />
                    </label>

                    <div className="drawer__actions">
                        <button type="button" className="btn btn--ghost" onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={submitting}>
                            {submitting ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </form>
            )}
        </Drawer>
    );
}
