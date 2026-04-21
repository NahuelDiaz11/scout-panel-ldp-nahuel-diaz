import { http, HttpResponse } from "msw";
import { mockPlayers, mockSeasons } from "../fixture";

export const handlers = [
  http.get("http://localhost:3001/api/players", () => {
    return HttpResponse.json({
      data: mockPlayers,
      meta: { total: 2, page: 1, limit: 12, totalPages: 1 },
      error: null,
    });
  }),

  http.get("http://localhost:3001/api/players/1", () => {
    return HttpResponse.json({
      data: mockPlayers[0],
      error: null,
    });
  }),

  http.get("http://localhost:3001/api/players/compare", () => {
    return HttpResponse.json({
      data: mockPlayers,
      error: null,
    });
  }),

  http.get("http://localhost:3001/api/players/positions", () => {
    return HttpResponse.json({ data: ["CF", "SS", "CM", "CB", "GK"], error: null });
  }),

  http.get("http://localhost:3001/api/players/nationalities", () => {
    return HttpResponse.json({ data: ["Argentina", "Uruguay"], error: null });
  }),

  http.get("http://localhost:3001/api/seasons", () => {
    return HttpResponse.json({ data: mockSeasons, error: null });
  }),
];