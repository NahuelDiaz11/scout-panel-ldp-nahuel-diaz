import { prisma } from "../../db/prisma";

jest.mock("../../db/prisma", () => ({
  prisma: {
    player: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    season: {
      findMany: jest.fn(),
    },
  },
}));

export const prismaMock = prisma as jest.Mocked<typeof prisma>;