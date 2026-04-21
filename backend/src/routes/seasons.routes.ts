import { Router } from "express";
import { getSeasons } from "../controllers/players.controller";

export const seasonsRouter = Router();

seasonsRouter.get("/", getSeasons);