import { useState, useEffect } from "react";
import { usePlayers } from "../hooks/usePlayers";
import type { PlayersFilters } from "../hooks/usePlayers";
import { PlayerCard } from "../components/players/PlayerCard";
import { PlayerFilters } from "../components/players/PlayerFilters";
import { Skeleton } from "../components/ui/Skeleton";

function PlayerCardSkeleton() {
    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: 16, display: "flex",
            flexDirection: "column", gap: 12,
        }}>
            <div style={{ display: "flex", gap: 12 }}>
                <Skeleton width={52} height={52} borderRadius="var(--radius-md)" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Skeleton height={16} width="70%" />
                    <Skeleton height={12} width="40%" />
                </div>
            </div>
            <Skeleton height={12} width="50%" />
            <Skeleton height={48} />
            <Skeleton height={32} />
        </div>
    );
}

export function PlayersPage() {
    const [filters, setFilters] = useState<PlayersFilters>({ page: 1, limit: 12 });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilters(filters), 350);
        return () => clearTimeout(timer);
    }, [filters]);

    const { data, isLoading, isError } = usePlayers(debouncedFilters);
    const players = data?.data || [];
    const meta = data?.meta;

    return (
        <div style={{ paddingBottom: 80 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Jugadores</h1>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    {meta ? `${meta.total} jugadores encontrados` : "Buscando jugadores..."}
                </p>
            </div>

            <PlayerFilters filters={filters} onChange={setFilters} />

            {isError && (
                <div style={{
                    textAlign: "center", padding: 48,
                    color: "var(--danger)", fontSize: 14,
                }}>
                    Error al cargar jugadores. ¿El backend está corriendo?
                </div>
            )}

            {isLoading ? (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 16,
                }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <PlayerCardSkeleton key={i} />
                    ))}
                </div>
            ) : players.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 64,
                    color: "var(--text-muted)", fontSize: 14,
                }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>No se encontraron jugadores</div>
                    <div>Probá cambiando los filtros de búsqueda</div>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 16,
                }}>
                    {players.map(player => (
                        <PlayerCard key={player.id} player={player} />
                    ))}
                </div>
            )}

            {meta && meta.totalPages > 1 && (
                <div style={{
                    display: "flex", justifyContent: "center",
                    alignItems: "center", gap: 8, marginTop: 32,
                }}>
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                        disabled={(filters.page || 1) <= 1}
                        style={{
                            padding: "8px 16px", fontSize: 13, fontWeight: 600,
                            border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                            color: "var(--text-muted)", opacity: (filters.page || 1) <= 1 ? 0.4 : 1,
                        }}
                    >
                        Anterior
                    </button>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        Página {filters.page} de {meta.totalPages}
                    </span>
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                        disabled={(filters.page || 1) >= meta.totalPages}
                        style={{
                            padding: "8px 16px", fontSize: 13, fontWeight: 600,
                            border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                            color: "var(--text-muted)",
                            opacity: (filters.page || 1) >= meta.totalPages ? 0.4 : 1,
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}