import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import { PlayerFilters } from "../components/players/PlayerFilters";
import { renderWithProviders } from "./utils/renderWithProviders";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function openAdvancedFilters() {
    fireEvent.click(screen.getByText(/Filtros/i));
}

describe("PlayerFilters", () => {
    it("renders search input", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );
        expect(
            screen.getByPlaceholderText("Buscar por nombre de jugador...")
        ).toBeInTheDocument();
    });

    it("calls onChange when name input changes", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );
        fireEvent.change(
            screen.getByPlaceholderText("Buscar por nombre de jugador..."),
            { target: { value: "merentiel" } }
        );
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ name: "merentiel", page: 1 })
        );
    });

    it("shows advanced filters when clicking Filtros button", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );
        expect(screen.queryByPlaceholderText("Ej: 16")).not.toBeInTheDocument();

        openAdvancedFilters();

        expect(screen.getByPlaceholderText("Ej: 16")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ej: 35")).toBeInTheDocument();
    });

    it("calls onChange when position changes", async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );

        openAdvancedFilters();

        const positionSelect = screen.getByDisplayValue("Todas");

        await waitFor(() => {
            expect(screen.getByRole('option', { name: "CF" })).toBeInTheDocument();
        });

        fireEvent.change(positionSelect, {
            target: { value: "CF" },
        });

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ position: "CF", page: 1 })
        );
    });

    it("calls onChange with ageMin when typed", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );
        openAdvancedFilters();

        fireEvent.change(screen.getByPlaceholderText("Ej: 16"), {
            target: { value: "25" },
        });
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ ageMin: 25, page: 1 })
        );
    });

    it("calls onChange with ageMax when typed", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );
        openAdvancedFilters();

        fireEvent.change(screen.getByPlaceholderText("Ej: 35"), {
            target: { value: "30" },
        });
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ ageMax: 30, page: 1 })
        );
    });

    it("resets page to 1 on any filter change", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 3, limit: 12 }} onChange={onChange} />
        );
        fireEvent.change(
            screen.getByPlaceholderText("Buscar por nombre de jugador..."),
            { target: { value: "colidio" } }
        );
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1 })
        );
    });

    it("shows active filters count badge", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters
                filters={{ page: 1, limit: 12, position: "CF", nationality: "Argentina" }}
                onChange={onChange}
            />
        );
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("shows clear all button when filters are active", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters
                filters={{ page: 1, limit: 12, name: "test" }}
                onChange={onChange}
            />
        );
        expect(screen.getByText("Limpiar todo")).toBeInTheDocument();
    });

    it("clears all filters when clicking Limpiar todo", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters
                filters={{ page: 1, limit: 12, name: "test", position: "CF" }}
                onChange={onChange}
            />
        );
        fireEvent.click(screen.getByText("Limpiar todo"));
        expect(onChange).toHaveBeenCalledWith({ page: 1 });
    });

    it("does not show clear all button when no filters active", () => {
        const onChange = vi.fn();
        renderWithProviders(
            <PlayerFilters filters={{ page: 1, limit: 12 }} onChange={onChange} />
        );
        expect(screen.queryByText("Limpiar todo")).not.toBeInTheDocument();
    });
});