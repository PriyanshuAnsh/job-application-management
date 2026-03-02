import { FormEvent, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

type Props = {
    application: JobApplication | null;
    open: boolean;
    onClose: () => void;
    onUpdate: (id: string, payload: Partial<CreateApplicationPayload>) => Promise<void>;
};

export function EditApplicationDrawer({ application, open, onClose, onUpdate }: Props) {
    const [form, setForm] = useState<Partial<CreateApplicationPayload>>({});
    const [submitting, setSubmitting] = useState(false);

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
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!application) return;
        setSubmitting(true);
        try { await onUpdate(application.id, form); onClose(); }
        finally { setSubmitting(false); }
    }

    return (
        <Sheet open={open} onOpenChange={v => !v && onClose()}>
            <SheetContent
                className="flex w-[480px] flex-col gap-0 p-0 sm:max-w-[480px]"
                style={{ background: "var(--jarvis-surface)", borderLeft: "1px solid var(--jarvis-cyan-border)" }}
            >
                {/* Top glow line */}
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)" }} />

                <SheetHeader className="border-b px-5 py-4" style={{ borderColor: "var(--jarvis-cyan-border)" }}>
                    <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--jarvis-cyan)", fontFamily: "var(--font-display)" }}>
                            MODIFY TARGET
                        </p>
                        <SheetTitle className="mt-0.5 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--jarvis-text)" }}>
                            Edit Application
                        </SheetTitle>
                    </div>
                </SheetHeader>

                {application && (
                    <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-5 gap-4">
                        {[
                            { label: "Company", key: "company", required: true },
                            { label: "Role", key: "role", required: true },
                            { label: "Location", key: "location", required: true },
                        ].map(({ label, key, required }) => (
                            <div key={key} className="grid gap-1.5">
                                <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>{label}</Label>
                                <Input
                                    required={required}
                                    value={(form[key as keyof typeof form] as string) ?? ""}
                                    onChange={e => set(key as keyof CreateApplicationPayload, e.target.value as never)}
                                    className="jarvis-input"
                                />
                            </div>
                        ))}

                        <div className="grid gap-1.5">
                            <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>Status</Label>
                            <Select value={form.status ?? "Wishlist"} onValueChange={v => set("status", v as JobApplication["status"])}>
                                <SelectTrigger className="jarvis-input"><SelectValue /></SelectTrigger>
                                <SelectContent style={{ background: "var(--jarvis-surface-2)", border: "1px solid var(--jarvis-cyan-border)", color: "var(--jarvis-text)" }}>
                                    {applicationStatuses.map(s => <SelectItem key={s} value={s} className="focus:bg-cyan-500/10 focus:text-cyan-300">{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>Applied Date</Label>
                            <Input type="date" value={form.appliedDate ?? ""} onChange={e => set("appliedDate", e.target.value)} className="jarvis-input" />
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>Job URL <span style={{ color: "var(--jarvis-text-faint)", fontWeight: 400 }}>(optional)</span></Label>
                            <Input type="url" value={form.jobUrl ?? ""} onChange={e => set("jobUrl", e.target.value.trim() || null)} className="jarvis-input" placeholder="https://..." />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>Salary Min</Label>
                                <Input type="number" min="0" placeholder="80000" value={form.salaryMin ?? ""} onChange={e => set("salaryMin", e.target.value ? Number(e.target.value) : null)} className="jarvis-input" />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>Salary Max</Label>
                                <Input type="number" min="0" placeholder="120000" value={form.salaryMax ?? ""} onChange={e => set("salaryMax", e.target.value ? Number(e.target.value) : null)} className="jarvis-input" />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-[0.7rem] font-bold uppercase tracking-wider" style={{ color: "var(--jarvis-text-faint)", fontFamily: "var(--font-display)" }}>Notes <span style={{ color: "var(--jarvis-text-faint)", fontWeight: 400 }}>(optional)</span></Label>
                            <Textarea rows={4} className="jarvis-input resize-none" value={form.notes ?? ""} onChange={e => set("notes", e.target.value.trim() || null)} placeholder="Recruiter, referral, rounds…" />
                        </div>

                        <div className="mt-auto flex justify-end gap-2 border-t pt-4" style={{ borderColor: "var(--jarvis-cyan-border)" }}>
                            <Button type="button" className="jarvis-btn-ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
                            <Button type="submit" className="jarvis-btn-primary" disabled={submitting}>
                                {submitting ? "Saving…" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    );
}
