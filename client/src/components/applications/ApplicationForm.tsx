import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { applicationStatuses } from "@/types/application";
import type { CreateApplicationPayload, JobApplication } from "@/types/application";

type ApplicationFormProps = {
    onCreate: (payload: CreateApplicationPayload) => Promise<void>;
};

const today = new Date().toISOString().slice(0, 10);

export function ApplicationForm({ onCreate }: ApplicationFormProps) {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState<JobApplication["status"]>("Wishlist");
    const [appliedDate, setAppliedDate] = useState(today);
    const [jobUrl, setJobUrl] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onCreate({
                company, role, location, status, appliedDate,
                jobUrl: jobUrl.trim() || null,
                salaryMin: salaryMin ? Number(salaryMin) : null,
                salaryMax: salaryMax ? Number(salaryMax) : null,
                notes: notes.trim() || null,
            });
            setCompany(""); setRole(""); setLocation(""); setStatus("Wishlist");
            setAppliedDate(today); setJobUrl(""); setSalaryMin(""); setSalaryMax(""); setNotes("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <motion.section
            className="jarvis-panel p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
        >
            {/* Header */}
            <div className="mb-4">
                <p
                    className="text-[0.68rem] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "var(--jarvis-cyan)", fontFamily: "var(--font-display)" }}
                >
                    New Target
                </p>
                <h2
                    className="mt-0.5 text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--jarvis-text)" }}
                >
                    Add Application
                </h2>
                <p className="text-sm" style={{ color: "var(--jarvis-text-dim)" }}>
                    Capture each opportunity as soon as you find it.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Row 1 */}
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Company</Label>
                    <Input required value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" className="jarvis-input" />
                </div>
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Role</Label>
                    <Input required value={role} onChange={e => setRole(e.target.value)} placeholder="Software Engineer" className="jarvis-input" />
                </div>
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Location</Label>
                    <Input required value={location} onChange={e => setLocation(e.target.value)} placeholder="Remote / New York" className="jarvis-input" />
                </div>
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Status</Label>
                    <Select value={status} onValueChange={v => setStatus(v as JobApplication["status"])}>
                        <SelectTrigger className="jarvis-input">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: "var(--jarvis-surface-2)", border: "1px solid var(--jarvis-cyan-border)", color: "var(--jarvis-text)" }}>
                            {applicationStatuses.map(s => (
                                <SelectItem key={s} value={s} className="focus:bg-cyan-500/10 focus:text-cyan-300">{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Row 2 */}
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Applied Date</Label>
                    <Input type="date" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} className="jarvis-input" />
                </div>
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Job URL <span style={{ color: "var(--jarvis-text-faint)", fontWeight: 400 }}>(optional)</span></Label>
                    <Input type="url" value={jobUrl} onChange={e => setJobUrl(e.target.value)} placeholder="https://..." className="jarvis-input" />
                </div>
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Salary Min <span style={{ color: "var(--jarvis-text-faint)", fontWeight: 400 }}>(optional)</span></Label>
                    <Input type="number" min="0" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="80000" className="jarvis-input" />
                </div>
                <div className="grid gap-1.5">
                    <Label className="jarvis-label">Salary Max <span style={{ color: "var(--jarvis-text-faint)", fontWeight: 400 }}>(optional)</span></Label>
                    <Input type="number" min="0" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="120000" className="jarvis-input" />
                </div>

                {/* Row 3 — Notes full width */}
                <div className="col-span-full grid gap-1.5">
                    <Label className="jarvis-label">Notes <span style={{ color: "var(--jarvis-text-faint)", fontWeight: 400 }}>(optional)</span></Label>
                    <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Recruiter name, referral, interview rounds…" className="jarvis-input resize-none" />
                </div>

                <div className="col-span-full flex justify-end">
                    <Button type="submit" disabled={submitting} className="jarvis-btn-primary gap-2">
                        <PlusCircle className="h-4 w-4" />
                        {submitting ? "Saving…" : "Save Application"}
                    </Button>
                </div>
            </form>
        </motion.section>
    );
}
