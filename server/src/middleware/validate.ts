import { z, ZodTypeAny } from "zod";
import type { Request, Response, NextFunction } from "express";
import { applicationStatuses } from "../types.js";

const nullableTrimmedString = z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v));

const nullableNumber = z
    .union([z.number().finite().nonnegative(), z.null(), z.literal("")])
    .transform((v) => (v === "" ? null : v));

export const createApplicationSchema = z.object({
    company: z.string().trim().min(1).max(120),
    role: z.string().trim().min(1).max(120),
    status: z.enum(applicationStatuses),
    location: z.string().trim().min(1).max(120),
    salaryMin: nullableNumber,
    salaryMax: nullableNumber,
    jobUrl: nullableTrimmedString,
    notes: nullableTrimmedString,
    appliedDate: z.string().date(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export function validateBody(schema: ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: "Validation failed", issues: parsed.error.flatten() });
            return;
        }
        req.body = parsed.data;
        next();
    };
}
