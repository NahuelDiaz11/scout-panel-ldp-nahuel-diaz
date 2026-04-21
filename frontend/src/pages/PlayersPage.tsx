import { useState, useEffect } from "react";
import { usePlayers } from "../hooks/usePlayers";
import type { PlayersFilters } from "../hooks/usePlayers";
import { PlayerCard } from "../components/players/PlayerCard";
import { PlayerFilters } from "../components/players/PlayerFilters";
import { Skeleton } from "../components/ui/Skeleton";
import { Binoculars, Users } from "lucide-react";

function PlayerCardSkeleton() {
    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "20px 16px", display: "flex",
            flexDirection: "column", alignItems: "center", gap: 16,
            height: 380,
        }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Skeleton width={30} height={24} />
                    <Skeleton width={20} height={16} />
                </div>
                <Skeleton width={100} height={100} borderRadius="50%" />
                <div style={{ width: 30 }} />
            </div>
            <Skeleton height={24} width="70%" />
            <div style={{ width: "100%", height: 1, background: "var(--border)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", width: "100%" }}>
                <Skeleton height={16} /><Skeleton height={16} />
                <Skeleton height={16} /><Skeleton height={16} />
            </div>
            <div style={{ marginTop: "auto", width: "100%" }}>
                <Skeleton height={36} />
            </div>
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
        <div style={{ paddingBottom: 80, fontFamily: "'Nunito Sans', sans-serif" }}>

            <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Badge Verde */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(0, 224, 148, 0.1)", color: "#00E094",
                    padding: "6px 12px", borderRadius: 100, width: "fit-content",
                    fontSize: 12, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase",
                    border: "1px solid rgba(0, 224, 148, 0.2)"
                }}>
                    <Binoculars size={14} strokeWidth={2.5} />
                    LDP Scout Panel
                </div>

                {/* Título Principal */}
                <h1 style={{
                    fontSize: "clamp(28px, 4vw, 36px)",
                    fontWeight: 900,
                    color: "#F2F2F2",
                    margin: 0,
                    letterSpacing: "-0.5px"
                }}>
                    Listado de Jugadores
                </h1>

                {/* Subtítulo / Contador Dinámico */}
                <p style={{
                    fontSize: 15, color: "#8C8C8C", margin: 0,
                    display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap"
                }}>
                    <Users size={16} />
                    Explora y compara entre
                    <span style={{ color: "#F2F2F2", fontWeight: 800 }}>
                        {meta ? meta.total : "..."}
                    </span>
                    perfiles profesionales.
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
                            background: "transparent",
                            color: "var(--text-muted)", opacity: (filters.page || 1) <= 1 ? 0.4 : 1,
                            cursor: (filters.page || 1) <= 1 ? "not-allowed" : "pointer"
                        }}
                    >
                        Anterior
                    </button>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>
                        Página {filters.page} de {meta.totalPages}
                    </span>
                    <button
                        onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                        disabled={(filters.page || 1) >= meta.totalPages}
                        style={{
                            padding: "8px 16px", fontSize: 13, fontWeight: 600,
                            border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                            background: "transparent",
                            color: "var(--text-muted)",
                            opacity: (filters.page || 1) >= meta.totalPages ? 0.4 : 1,
                            cursor: (filters.page || 1) >= meta.totalPages ? "not-allowed" : "pointer"
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}