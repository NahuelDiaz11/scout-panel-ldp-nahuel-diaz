import { prisma } from "../lib/prisma";

export const ShortlistService = {
    async toggle(userId: number, playerId: number) {
        const existing = await prisma.shortlistPlayer.findUnique({
            where: {
                userId_playerId: { userId, playerId },
            },
        });

        if (existing) {
            await prisma.shortlistPlayer.delete({ where: { id: existing.id } });
            return { message: "Removido de la shortlist", action: "removed" };
        } else {
            await prisma.shortlistPlayer.create({ data: { userId, playerId } });
            return { message: "Agregado a la shortlist", action: "added" };
        }
    },

    async getByUser(userId: number) {
        return await prisma.shortlistPlayer.findMany({
            where: { userId },
            include: {
                player: {
                    include: {
                        team: true,
                        stats: { orderBy: { seasonId: 'desc' }, take: 1 }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};