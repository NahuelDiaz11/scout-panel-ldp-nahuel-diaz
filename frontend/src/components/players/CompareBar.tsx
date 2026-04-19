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
            padding: "12px 32px",
            display: "flex", alignItems: "center", gap: 16,
            zIndex: 200,
        }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                Comparando:
            </span>

            <div style={{ display: "flex", gap: 8, flex: 1 }}>
                {selectedPlayers.map(p => (
                    <div key={p.id} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: "var(--bg-card)",
                        border: "1px solid var(--primary)",
                        borderRadius: "var(--radius-sm)",
                        padding: "4px 10px",
                        fontSize: 13,
                    }}>
                        <span style={{ color: "var(--text)" }}>
                            {p.firstName} {p.lastName}
                        </span>
                        <button
                            onClick={() => removePlayer(p.id)}
                            style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1 }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => { clearPlayers(); }}
                style={{
                    padding: "8px 16px", fontSize: 13, fontWeight: 600,
                    color: "var(--text-muted)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                }}
            >
                Limpiar
            </button>

            <button
                onClick={() => navigate("/compare")}
                disabled={selectedPlayers.length < 2}
                style={{
                    padding: "8px 20px", fontSize: 13, fontWeight: 700,
                    background: "var(--primary)", color: "#0F0F0F",
                    borderRadius: "var(--radius-sm)",
                    opacity: selectedPlayers.length < 2 ? 0.5 : 1,
                }}
            >
                Comparar {selectedPlayers.length > 0 && `(${selectedPlayers.length})`}
            </button>
        </div>
    );
}