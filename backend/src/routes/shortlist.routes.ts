import { Router } from "express";
import { toggleShortlist, getShortlist } from "../controllers/shortlist.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getShortlist);
router.post("/toggle", toggleShortlist);

export { router as shortlistRouter };