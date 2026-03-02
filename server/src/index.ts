import cors from "cors";
import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getStats,
  listApplications,
  updateApplication
} from "./store.js";
import { createApplicationSchema, updateApplicationSchema } from "./validation.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/applications", (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const applications = listApplications({ status, search });
  res.json(applications);
});

app.get("/api/applications/:id", (req, res) => {
  const appData = getApplicationById(req.params.id);

  if (!appData) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  res.json(appData);
});

app.post("/api/applications", (req, res) => {
  const parsed = createApplicationSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", issues: parsed.error.flatten() });
    return;
  }

  const created = createApplication(parsed.data);
  res.status(201).json(created);
});

app.patch("/api/applications/:id", (req, res) => {
  const parsed = updateApplicationSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Validation failed", issues: parsed.error.flatten() });
    return;
  }

  const updated = updateApplication(req.params.id, parsed.data);

  if (!updated) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  res.json(updated);
});

app.delete("/api/applications/:id", (req, res) => {
  const deleted = deleteApplication(req.params.id);

  if (!deleted) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  res.status(204).send();
});

app.get("/api/stats", (_req, res) => {
  res.json(getStats());
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
