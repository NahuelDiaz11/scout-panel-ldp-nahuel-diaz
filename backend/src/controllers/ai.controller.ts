import { Request, Response } from "express";
import { generateScoutReport } from "../services/ai.service";

export const comparePlayersAI = async (req: Request, res: Response) => {
    try {
        const { players } = req.body;

        const validPlayers = Array.isArray(players)
            ? players.filter((p: any) => p && p.firstName && p.lastName)
            : [];

        if (validPlayers.length < 2 || validPlayers.length > 3) {
            return res.status(400).json({
                error: "Se requieren exactamente 2 o 3 jugadores válidos para la comparación."
            });
        }

        const aiReport = await generateScoutReport(validPlayers);

        return res.status(200).json({
            success: true,
            report: aiReport
        });

    } catch (error) {
        console.error("Error en controller:", error);
        return res.status(500).json({
            error: "Error interno del servidor al procesar la solicitud de IA."
        });
    }
};