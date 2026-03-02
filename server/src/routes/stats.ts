import { Router } from "express";
import { getStats } from "../models/application.js";

export const statsRouter = Router();

statsRouter.get("/stats", (_req, res) => {
    res.json(getStats());
});
