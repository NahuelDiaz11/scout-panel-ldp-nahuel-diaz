import { prisma } from "../db/prisma";
import {
  findPlayers,
  findPlayerById,
  findPlayersToCompare,
  findPositions,
  findNationalities,
} from "../services/players.service";
import { AppError } from "../middleware/errorHandler";

jest.mock("../db/prisma", () => ({
  prisma: {
    player: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const playerMock = {
  id: 1,
  firstName: "Miguel Ángel",
  lastName: "Merentiel Serrano",
  dateOfBirth: new Date("1994-06-14"),
  nationality: "Uruguay",
  position: "SS",
  photoUrl: null,
  teamId: 1,
  createdAt: new Date(),
  team: { id: 1, name: "CA Boca Juniors", country: "Argentina", logoUrl: null, createdAt: new Date() },
  stats: [],
};

const player2Mock = {
  ...playerMock,
  id: 2,
  firstName: "Facundo",
  lastName: "Colidio",
  nationality: "Argentina",
  position: "CF",
};

describe("PlayersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findPlayers", () => {
    it("returns paginated players", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([playerMock]);
      (prisma.player.count as jest.Mock).mockResolvedValue(1);

      const result = await findPlayers({
        page: 1,
        limit: 12,
      });

      expect(result.players).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(prisma.player.findMany).toHaveBeenCalledTimes(1);
    });

    it("filters by name", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([playerMock]);
      (prisma.player.count as jest.Mock).mockResolvedValue(1);

      await findPlayers({ name: "merentiel", page: 1, limit: 12 });

      const call = (prisma.player.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.OR).toBeDefined();
      expect(call.where.OR[0].firstName.contains).toBe("merentiel");
    });

    it("filters by position", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.player.count as jest.Mock).mockResolvedValue(0);

      await findPlayers({ position: "CF", page: 1, limit: 12 });

      const call = (prisma.player.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.position.equals).toBe("CF");
    });

    it("filters by nationality", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.player.count as jest.Mock).mockResolvedValue(0);

      await findPlayers({ nationality: "Uruguay", page: 1, limit: 12 });

      const call = (prisma.player.findMany as jest.Mock).mock.calls[0][0];
      expect(call.where.nationality.contains).toBe("Uruguay");
    });

    it("applies correct pagination skip", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.player.count as jest.Mock).mockResolvedValue(0);

      await findPlayers({ page: 3, limit: 12 });

      const call = (prisma.player.findMany as jest.Mock).mock.calls[0][0];
      expect(call.skip).toBe(24);
    });
  });

  describe("findPlayerById", () => {
    it("returns player when found", async () => {
      (prisma.player.findUnique as jest.Mock).mockResolvedValue(playerMock);

      const result = await findPlayerById(1);

      expect(result.id).toBe(1);
      expect(result.lastName).toBe("Merentiel Serrano");
    });

    it("throws 404 when player not found", async () => {
      (prisma.player.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(findPlayerById(999)).rejects.toThrow(AppError);
      await expect(findPlayerById(999)).rejects.toMatchObject({
        statusCode: 404,
        message: "Player not found",
      });
    });

    it("throws 400 for invalid ID", async () => {
      await expect(findPlayerById(NaN)).rejects.toThrow(AppError);
      await expect(findPlayerById(NaN)).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });

  describe("findPlayersToCompare", () => {
    it("returns players for comparison", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([
        playerMock,
        player2Mock,
      ]);

      const result = await findPlayersToCompare([1, 2]);

      expect(result).toHaveLength(2);
    });

    it("throws 400 when less than 2 players found", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([playerMock]);

      await expect(findPlayersToCompare([1, 999])).rejects.toThrow(AppError);
      await expect(findPlayersToCompare([1, 999])).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it("throws 400 for invalid IDs", async () => {
      await expect(findPlayersToCompare([1, NaN])).rejects.toThrow(AppError);
    });
  });

  describe("findPositions", () => {
    it("returns list of unique positions", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([
        { position: "CF" },
        { position: "SS" },
        { position: "CM" },
      ]);

      const result = await findPositions();

      expect(result).toEqual(["CF", "SS", "CM"]);
    });
  });

  describe("findNationalities", () => {
    it("returns list of unique nationalities", async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([
        { nationality: "Argentina" },
        { nationality: "Uruguay" },
      ]);

      const result = await findNationalities();

      expect(result).toEqual(["Argentina", "Uruguay"]);
    });
  });
});