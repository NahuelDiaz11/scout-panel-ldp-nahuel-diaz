import { Router } from "express";

export const authRouter = Router();

authRouter.get("/ping", (_req, res) => {
  res.json({ data: "auth ok", error: null });
});