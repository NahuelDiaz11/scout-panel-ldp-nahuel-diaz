import { create } from "zustand";
import type { Player } from "../types";

interface CompareStore {
  selectedPlayers: Player[];
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: number) => void;
  clearPlayers: () => void;
  isSelected: (playerId: number) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  selectedPlayers: [],

  addPlayer: (player) => {
    const { selectedPlayers } = get();
    if (selectedPlayers.length >= 3) return;
    if (selectedPlayers.find((p) => p.id === player.id)) return;
    set({ selectedPlayers: [...selectedPlayers, player] });
  },

  removePlayer: (playerId) => {
    set((state) => ({
      selectedPlayers: state.selectedPlayers.filter((p) => p.id !== playerId),
    }));
  },

  clearPlayers: () => set({ selectedPlayers: [] }),

  isSelected: (playerId) => {
    return get().selectedPlayers.some((p) => p.id === playerId);
  },
}));