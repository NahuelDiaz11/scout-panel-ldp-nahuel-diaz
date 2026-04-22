import { Router } from "express";
import { getSeasons } from "../controllers/players.controller";
import { authMiddleware } from "../middleware/auth";

export const seasonsRouter = Router();

seasonsRouter.get("/", authMiddleware, getSeasons);