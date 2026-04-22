import { Router } from "express";
import { comparePlayersAI } from "../controllers/ai.controller";

const router = Router();

router.post("/compare", comparePlayersAI);

export default router;