import express from "express";
import cors from "cors";
import { playersRouter } from "./routes/players.routes";
import { seasonsRouter } from "./routes/seasons.routes";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/players", playersRouter);
app.use("/api/seasons", seasonsRouter);
app.use("/api/auth", authRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export { app };