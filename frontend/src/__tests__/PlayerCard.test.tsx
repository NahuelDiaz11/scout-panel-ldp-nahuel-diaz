import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { PlayerCard } from "../components/players/PlayerCard";
import { renderWithProviders } from "./utils/renderWithProviders";
import { useCompareStore } from "../store/useCompareStore";
import { mockPlayers } from "./fixture";

const player = mockPlayers[0];

describe("PlayerCard", () => {
    beforeEach(() => {
        useCompareStore.setState({ selectedPlayers: [] });
    });

    it("renders player name", () => {
        renderWithProviders(<PlayerCard player={player} />);
        expect(screen.getByText("M. Merentiel Serrano")).toBeInTheDocument();
    });

    it("renders player position badge", () => {
        renderWithProviders(<PlayerCard player={player} />);
        expect(screen.getByText("SS")).toBeInTheDocument();
    });

    it("renders latest stats", () => {
        renderWithProviders(<PlayerCard player={player} />);
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("renders initials when no photo", () => {
        renderWithProviders(<PlayerCard player={player} />);
        expect(screen.getByText("MM")).toBeInTheDocument();
    });

    it("shows add to compare button", () => {
        renderWithProviders(<PlayerCard player={player} />);
        expect(screen.getByText("Comparar")).toBeInTheDocument();
    });

    it("adds player to compare store on button click", () => {
        renderWithProviders(<PlayerCard player={player} />);
        fireEvent.click(screen.getByText("Comparar"));
        const { selectedPlayers } = useCompareStore.getState();
        expect(selectedPlayers).toHaveLength(1);
        expect(selectedPlayers[0].id).toBe(1);
    });

    it("shows remove button when player is selected", () => {
        useCompareStore.setState({ selectedPlayers: [player] });
        renderWithProviders(<PlayerCard player={player} />);
        expect(screen.getByText("Quitar")).toBeInTheDocument();
    });

    it("removes player from compare store when already selected", () => {
        useCompareStore.setState({ selectedPlayers: [player] });
        renderWithProviders(<PlayerCard player={player} />);
        fireEvent.click(screen.getByText("Quitar"));
        const { selectedPlayers } = useCompareStore.getState();
        expect(selectedPlayers).toHaveLength(0);
    });

    it("disables add button when 3 players already selected", () => {
        useCompareStore.setState({
            selectedPlayers: [
                mockPlayers[0],
                { ...mockPlayers[1], id: 3 },
                { ...mockPlayers[1], id: 4 },
            ],
        });
        renderWithProviders(<PlayerCard player={{ ...mockPlayers[1], id: 5 }} />);
        const btn = screen.getByText("Comparar").closest("button");
        expect(btn).toBeDisabled();
    });
});