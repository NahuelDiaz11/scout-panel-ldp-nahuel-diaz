import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-ldp";

export const AuthService = {
  async login(email: string, passwordPlana: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, "Credenciales incorrectas");
    }

    const isValidPassword = await bcrypt.compare(passwordPlana, user.password);

    if (!isValidPassword) {
      throw new AppError(401, "Credenciales incorrectas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
};