import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { PaginatedResponse, Player, ApiResponse, PlayerStatsResponse } from "../types";
export interface PlayersFilters {
  name?: string;
  position?: string;
  nationality?: string;
  ageMin?: number;
  ageMax?: number;
  page?: number;
  limit?: number;
}

export function usePlayers(filters: PlayersFilters) {
  return useQuery<PaginatedResponse<Player>>({
    queryKey: ["players", filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
      );
      const { data } = await api.get("/players", { params });
      return data;
    },
  });
}

export function usePlayer(id: number) {
  return useQuery<ApiResponse<Player>>({
    queryKey: ["player", id],
    queryFn: async () => {
      const { data } = await api.get(`/players/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useComparePlayers(ids: number[]) {
  return useQuery<ApiResponse<Player[]>>({
    queryKey: ["compare", ids],
    queryFn: async () => {
      const { data } = await api.get("/players/compare", {
        params: { ids: ids.join(",") },
      });
      return data;
    },
    enabled: ids.length >= 2,
  });
}

export function usePositions() {
  return useQuery<ApiResponse<string[]>>({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data } = await api.get("/players/positions");
      return data;
    },
  });
}

export function useNationalities() {
  return useQuery<ApiResponse<string[]>>({
    queryKey: ["nationalities"],
    queryFn: async () => {
      const { data } = await api.get("/players/nationalities");
      return data;
    },
  });
}

export function usePlayerStats(id: number) {
  return useQuery<ApiResponse<PlayerStatsResponse>>({
    queryKey: ["player-stats", id],
    queryFn: async () => {
      const { data } = await api.get(`/players/${id}/stats`);
      return data;
    },
    enabled: !!id,
  });
}