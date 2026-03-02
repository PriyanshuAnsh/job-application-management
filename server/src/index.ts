import cors from "cors";
import express from "express";
import { applicationsRouter } from "./routes/applications.js";
import { healthRouter } from "./routes/health.js";
import { statsRouter } from "./routes/stats.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.use(healthRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api", statsRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
