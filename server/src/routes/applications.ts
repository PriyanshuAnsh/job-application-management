import { Router } from "express";
import {
    createApplication,
    deleteApplication,
    getApplicationById,
    listApplications,
    updateApplication,
} from "../models/application.js";
import {
    createApplicationSchema,
    updateApplicationSchema,
    validateBody,
} from "../middleware/validate.js";
import type { CreateApplicationInput } from "../types.js";

export const applicationsRouter = Router();

applicationsRouter.get("/", (req, res) => {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    res.json(listApplications({ status, search }));
});

applicationsRouter.get("/:id", (req, res) => {
    const app = getApplicationById(req.params.id);
    if (!app) {
        res.status(404).json({ message: "Application not found" });
        return;
    }
    res.json(app);
});

// validateBody has already set req.body to the validated shape by the time the handler runs.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
applicationsRouter.post("/", validateBody(createApplicationSchema), (req: any, res) => {
    const created = createApplication(req.body as CreateApplicationInput);
    res.status(201).json(created);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
applicationsRouter.patch("/:id", validateBody(updateApplicationSchema), (req: any, res) => {
    const updated = updateApplication(req.params.id, req.body as Partial<CreateApplicationInput>);
    if (!updated) {
        res.status(404).json({ message: "Application not found" });
        return;
    }
    res.json(updated);
});

applicationsRouter.delete("/:id", (req, res) => {
    const deleted = deleteApplication(req.params.id);
    if (!deleted) {
        res.status(404).json({ message: "Application not found" });
        return;
    }
    res.status(204).send();
});
