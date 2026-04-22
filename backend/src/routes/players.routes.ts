import { Router } from "express";
import {
  getPlayers,
  getPlayerById,
  comparePlayers,
  getPositions,
  getNationalities,
  getPlayerStats,
} from "../controllers/players.controller";
import { validate } from "../middleware/validate";
import { playersQuerySchema, compareQuerySchema } from "../schemas/players.schema";
import { authMiddleware } from "../middleware/auth";

export const playersRouter = Router();

playersRouter.use(authMiddleware);

// GET /api/players?name=&position=&nationality=&ageMin=&ageMax=&page=
playersRouter.get("/", validate(playersQuerySchema), getPlayers);

// GET /api/players/compare?ids=1,2,3
playersRouter.get("/compare", validate(compareQuerySchema), comparePlayers);

// GET /api/players/positions — para los filtros del frontend
playersRouter.get("/positions", getPositions);

// GET /api/players/nationalities — para los filtros del frontend
playersRouter.get("/nationalities", getNationalities);

// GET /api/players/:id
playersRouter.get("/:id", getPlayerById);

playersRouter.get("/:id/stats", getPlayerStats);