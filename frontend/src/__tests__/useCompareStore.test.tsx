import { describe, it, expect, beforeEach } from "vitest";
import { useCompareStore } from "../store/useCompareStore";
import { mockPlayers } from "./fixture";

describe("useCompareStore", () => {
  beforeEach(() => {
    useCompareStore.setState({ selectedPlayers: [] });
  });

  it("adds a player", () => {
    useCompareStore.getState().addPlayer(mockPlayers[0]);
    expect(useCompareStore.getState().selectedPlayers).toHaveLength(1);
  });

  it("does not add duplicate players", () => {
    useCompareStore.getState().addPlayer(mockPlayers[0]);
    useCompareStore.getState().addPlayer(mockPlayers[0]);
    expect(useCompareStore.getState().selectedPlayers).toHaveLength(1);
  });

  it("does not add more than 3 players", () => {
    useCompareStore.getState().addPlayer({ ...mockPlayers[0], id: 1 });
    useCompareStore.getState().addPlayer({ ...mockPlayers[0], id: 2 });
    useCompareStore.getState().addPlayer({ ...mockPlayers[0], id: 3 });
    useCompareStore.getState().addPlayer({ ...mockPlayers[0], id: 4 });
    expect(useCompareStore.getState().selectedPlayers).toHaveLength(3);
  });

  it("removes a player by id", () => {
    useCompareStore.getState().addPlayer(mockPlayers[0]);
    useCompareStore.getState().removePlayer(mockPlayers[0].id);
    expect(useCompareStore.getState().selectedPlayers).toHaveLength(0);
  });

  it("clears all players", () => {
    useCompareStore.getState().addPlayer(mockPlayers[0]);
    useCompareStore.getState().addPlayer(mockPlayers[1]);
    useCompareStore.getState().clearPlayers();
    expect(useCompareStore.getState().selectedPlayers).toHaveLength(0);
  });

  it("isSelected returns true for added player", () => {
    useCompareStore.getState().addPlayer(mockPlayers[0]);
    expect(useCompareStore.getState().isSelected(mockPlayers[0].id)).toBe(true);
  });

  it("isSelected returns false for non-added player", () => {
    expect(useCompareStore.getState().isSelected(999)).toBe(false);
  });
});