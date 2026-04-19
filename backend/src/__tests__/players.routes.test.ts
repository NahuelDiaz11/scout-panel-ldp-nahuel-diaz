import request from "supertest";
import { app } from "../app";
import { prisma } from "../db/prisma";

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

describe("GET /api/players", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 with players list", async () => {
    (prisma.player.findMany as jest.Mock).mockResolvedValue([playerMock]);
    (prisma.player.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get("/api/players");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.error).toBeNull();
  });

  it("returns 400 for invalid age filter", async () => {
    const res = await request(app).get("/api/players?ageMin=abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("GET /api/players/:id", () => {
  it("returns 200 with player data", async () => {
    (prisma.player.findUnique as jest.Mock).mockResolvedValue(playerMock);

    const res = await request(app).get("/api/players/1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it("returns 404 when player not found", async () => {
    (prisma.player.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/api/players/999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Player not found");
  });
});

describe("GET /api/players/compare", () => {
  it("returns 200 with two players", async () => {
    (prisma.player.findMany as jest.Mock).mockResolvedValue([
      playerMock,
      { ...playerMock, id: 2 },
    ]);

    const res = await request(app).get("/api/players/compare?ids=1,2");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("returns 400 for invalid ids format", async () => {
    const res = await request(app).get("/api/players/compare?ids=1");

    expect(res.status).toBe(400);
  });
});