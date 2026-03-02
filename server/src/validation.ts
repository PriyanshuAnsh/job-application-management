import { z } from "zod";
import { applicationStatuses } from "./types.js";

const nullableTrimmedString = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .nullable()
  .or(z.literal(""))
  .transform((value) => (value === "" ? null : value));

const nullableNumber = z
  .union([z.number().finite().nonnegative(), z.null(), z.literal("")])
  .transform((value) => (value === "" ? null : value));

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  status: z.enum(applicationStatuses),
  location: z.string().trim().min(1).max(120),
  salaryMin: nullableNumber,
  salaryMax: nullableNumber,
  jobUrl: nullableTrimmedString,
  notes: nullableTrimmedString,
  appliedDate: z.string().date()
});

export const updateApplicationSchema = createApplicationSchema.partial();
