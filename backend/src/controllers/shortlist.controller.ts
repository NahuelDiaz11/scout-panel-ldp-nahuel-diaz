import { Request, Response, NextFunction } from "express";
import { ShortlistService } from "../services/shortlist.service";

export async function toggleShortlist(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.id;
        const { playerId } = req.body;

        if (!playerId) {
            return res.status(400).json({ error: "playerId es requerido" });
        }

        const result = await ShortlistService.toggle(userId, Number(playerId));
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getShortlist(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.id;
        const list = await ShortlistService.getByUser(userId);
        res.json(list);
    } catch (error) {
        next(error);
    }
}