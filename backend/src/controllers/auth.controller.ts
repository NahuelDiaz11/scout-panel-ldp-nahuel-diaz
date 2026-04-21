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

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new AppError(400, "Nombre, email y contraseña son requeridos");
        }

        const result = await AuthService.register(name, email, password);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}