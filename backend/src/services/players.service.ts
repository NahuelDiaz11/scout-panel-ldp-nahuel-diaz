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

export async function findPlayersToCompare(ids: number[], seasonId?: number) {
  if (ids.some(isNaN)) {
    throw new AppError(400, "Invalid player IDs");
  }

  // jugadores con sus stats filtradas
  const players = await prisma.player.findMany({
    where: { id: { in: ids } },
    include: {
      team: true,
      stats: {
        where: seasonId ? { seasonId } : undefined,
        include: { season: true },
        orderBy: { season: { name: "desc" } },
      },
    },
  });

  if (players.length < 2) {
    throw new AppError(400, "At least 2 valid players are required");
  }

  // pares para calcular percentiles

  const positions = players.map(p => p.position);
  const peersStats = await prisma.playerStats.findMany({
    where: {
      player: { position: { in: positions } },
      seasonId: seasonId ? seasonId : undefined 
    },
  });

  function getPercentile(value: number, key: string, position: string, higherIsBetter = true) {
    const values = peersStats
      .filter(s => {
        return true; 
      })
      .map(s => Number((s as any)[key]) || 0);

    if (values.length === 0) return 0;
    const below = values.filter(v => higherIsBetter ? v <= value : v >= value).length;
    return Math.round((below / values.length) * 100);
  }

  const playersWithPercentiles = players.map(player => {
    const latest = player.stats[0];
    if (!latest) return { ...player, percentiles: null };

    const percentiles = {
      goals: getPercentile(Number(latest.goals), "goals", player.position),
      assists: getPercentile(Number(latest.assists), "assists", player.position),
      xG: getPercentile(Number(latest.xG), "xG", player.position),
      xA: getPercentile(Number(latest.xA), "xA", player.position),
      recoveries: getPercentile(Number(latest.recoveries), "recoveries", player.position),
      shotsOnTarget: getPercentile(Number(latest.shotsOnTarget), "shotsOnTarget", player.position),
      successfulPasses: getPercentile(Number(latest.successfulPasses), "successfulPasses", player.position),
      passAccuracy: getPercentile(Number(latest.passAccuracy), "passAccuracy", player.position),
      aerialDuelsWon: getPercentile(Number(latest.aerialDuelsWon), "aerialDuelsWon", player.position),
      defensiveDuelsWon: getPercentile(Number(latest.defensiveDuelsWon), "defensiveDuelsWon", player.position),
      // Agregamos esta clave para que el Radar y la Tabla la encuentren fácil
      defensiveActions: getPercentile(Number(latest.defensiveDuelsWon), "defensiveDuelsWon", player.position), 
    };

    return { ...player, percentiles };
  });

  return playersWithPercentiles;
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

export async function findPlayerStats(playerId: number) {
  if (isNaN(playerId)) throw new AppError(400, "Invalid player ID");

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      team: true,
      stats: {
        include: { season: true },
        orderBy: { season: { name: "desc" } },
      },
    },
  });

  if (!player) throw new AppError(404, "Player not found");

  const peers = await prisma.playerStats.findMany({
    where: {
      player: { position: player.position },
    },
    include: {
      season: true,
      player: { select: { id: true, position: true } },
    },
  });

  const latestStats = player.stats[0];
  if (!latestStats) {
    return { player, percentiles: null };
  }

  // Calcular percentil de una métrica
  function calcPercentile(key: keyof typeof latestStats, higherIsBetter = true) {
    const values = peers
      .map((p) => Number(p[key as keyof typeof p]) ?? 0)
      .filter((v) => !isNaN(v));

    if (values.length === 0) return 0;

    const playerValue = Number(latestStats[key]) ?? 0;
    const below = values.filter((v) =>
      higherIsBetter ? v <= playerValue : v >= playerValue
    ).length;

    return Math.round((below / values.length) * 100);
  }

  const percentiles = {
    goals: calcPercentile("goals"),
    assists: calcPercentile("assists"),
    xG: calcPercentile("xG"),
    xA: calcPercentile("xA"),
    shotsOnTarget: calcPercentile("shotsOnTarget"),
    successfulPasses: calcPercentile("successfulPasses"),
    passAccuracy: calcPercentile("passAccuracy"),
    aerialDuelsWon: calcPercentile("aerialDuelsWon"),
    defensiveDuelsWon: calcPercentile("defensiveDuelsWon"),
    recoveries: calcPercentile("recoveries"),
    yellowCards: calcPercentile("yellowCards", false),
    redCards: calcPercentile("redCards", false),
    flagUrl: true,
  };

  return { player, percentiles };
}

export async function findSeasons() {
  return prisma.season.findMany({
    orderBy: { name: "desc" },
  });
}