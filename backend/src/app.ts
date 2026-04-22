import "dotenv/config";
import express from "express";
import cors from "cors";
import { playersRouter } from "./routes/players.routes";
import { seasonsRouter } from "./routes/seasons.routes";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { shortlistRouter } from "./routes/shortlist.routes";
import aiRoutes from './routes/ai.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use("/api/players", playersRouter);
app.use("/api/seasons", seasonsRouter);
app.use("/api/auth", authRouter);
app.use("/api/shortlist", shortlistRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export { app };