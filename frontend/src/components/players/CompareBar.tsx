import { useNavigate } from "react-router-dom";
import { useCompareStore } from "../../store/useCompareStore";

export function CompareBar() {
    const { selectedPlayers, removePlayer, clearPlayers } = useCompareStore();
    const navigate = useNavigate();

    if (selectedPlayers.length === 0) return null;

    return (
        <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            padding: "12px clamp(16px, 5vw, 32px)",
            display: "flex",
            flexDirection: window.innerWidth < 640 ? "column" : "row",
            alignItems: "center",
            gap: 12,
            zIndex: 200,
            boxShadow: "0 -4px 12px rgba(0,0,0,0.2)"
        }}>
            {/* Contenedor de "Comparando" + Jugadores */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: 1,
                width: "100%",
                overflowX: "auto",
                scrollbarWidth: "none"
            }}>
                <span style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: 600
                }}>
                    {window.innerWidth < 640 ? "" : "Comparando:"}
                </span>

                <div style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "nowrap"
                }}>
                    {selectedPlayers.map(p => (
                        <div key={p.id} style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: "var(--bg-card)",
                            border: "1px solid var(--primary)",
                            borderRadius: "var(--radius-sm)",
                            padding: "4px 8px",
                            fontSize: 12,
                            whiteSpace: "nowrap"
                        }}>
                            <span style={{ color: "var(--text)" }}>
                                {p.lastName}
                            </span>
                            <button
                                onClick={() => removePlayer(p.id)}
                                style={{ color: "var(--primary)", fontSize: 16, cursor: "pointer" }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botones de acción */}
            <div style={{
                display: "flex",
                gap: 8,
                width: window.innerWidth < 640 ? "100%" : "auto"
            }}>
                <button
                    onClick={() => clearPlayers()}
                    style={{
                        flex: 1,
                        padding: "10px 16px", fontSize: 13, fontWeight: 600,
                        color: "var(--text-muted)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer"
                    }}
                >
                    Limpiar
                </button>

                <button
                    onClick={() => navigate("/compare")}
                    disabled={selectedPlayers.length < 2}
                    style={{
                        flex: 2,
                        padding: "10px 20px", fontSize: 13, fontWeight: 700,
                        background: "var(--primary)", color: "#0F0F0F",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        opacity: selectedPlayers.length < 2 ? 0.5 : 1,
                        transition: "all 0.2s"
                    }}
                >
                    Comparar ({selectedPlayers.length})
                </button>
            </div>
        </div>
    );
}