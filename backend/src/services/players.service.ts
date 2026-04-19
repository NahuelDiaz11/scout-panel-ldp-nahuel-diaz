import { prisma } from "../db/prisma";
import { AppError } from "../middleware/errorHandler";
import { PlayersQuery } from "../schemas/players.schema";

export async function findPlayers(query: PlayersQuery) {
  const { name, position, nationality, ageMin, ageMax, page, limit } = query;

  const today = new Date();

  const where: any = {
    ...(name && {
      OR: [
        { firstName: { contains: name, mode: "insensitive" } },
        { lastName: { contains: name, mode: "insensitive" } },
      ],
    }),
    ...(position && {
      position: { equals: position, mode: "insensitive" },
    }),
    ...(nationality && {
      nationality: { contains: nationality, mode: "insensitive" },
    }),
    ...((ageMin || ageMax) && {
      dateOfBirth: {
        ...(ageMax && {
          gte: new Date(
            today.getFullYear() - ageMax,
            today.getMonth(),
            today.getDate()
          ),
        }),
        ...(ageMin && {
          lte: new Date(
            today.getFullYear() - ageMin,
            today.getMonth(),
            today.getDate()
          ),
        }),
      },
    }),
  };

  const skip = (page - 1) * limit;

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      skip,
      take: limit,
      include: {
        team: true,
        stats: {
          include: { season: true },
          orderBy: { season: { name: "desc" } },
          take: 1,
        },
      },
      orderBy: { lastName: "asc" },
    }),
    prisma.player.count({ where }),
  ]);

  return {
    players,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findPlayerById(id: number) {
  if (isNaN(id)) throw new AppError(400, "Invalid player ID");

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      team: true,
      stats: {
        include: { season: true },
        orderBy: { season: { name: "desc" } },
      },
    },
  });

  if (!player) throw new AppError(404, "Player not found");

  return player;
}

export async function findPlayersToCompare(ids: number[]) {
  if (ids.some(isNaN)) {
    throw new AppError(400, "Invalid player IDs");
  }

  const players = await prisma.player.findMany({
    where: { id: { in: ids } },
    include: {
      team: true,
      stats: {
        include: { season: true },
        orderBy: { season: { name: "desc" } },
      },
    },
  });

  if (players.length < 2) {
    throw new AppError(400, "At least 2 valid players are required");
  }

  return players;
}

export async function findPositions() {
  const result = await prisma.player.findMany({
    select: { position: true },
    distinct: ["position"],
    orderBy: { position: "asc" },
  });

  return result.map((p) => p.position);
}

export async function findNationalities() {
  const result = await prisma.player.findMany({
    select: { nationality: true },
    distinct: ["nationality"],
    orderBy: { nationality: "asc" },
  });

  return result.map((p) => p.nationality);
}