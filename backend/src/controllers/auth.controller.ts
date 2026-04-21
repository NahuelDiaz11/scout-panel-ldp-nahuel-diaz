import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import { AuthService } from "../services/auth.service";

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError(400, "Email y contraseña son requeridos");
        }

        const result = await AuthService.login(email, password);

        res.json(result);
    } catch (error) {
        next(error);
    }
}