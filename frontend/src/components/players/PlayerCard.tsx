import type { Player } from "../../types";
import { useCompareStore } from "../../store/useCompareStore";
import { Badge } from "../ui/Badge";

const POSITION_COLORS: Record<string, "green" | "blue" | "purple" | "default"> = {
    CF: "green", SS: "green",
    CAM: "blue", CM: "blue",
    CB: "purple", LB: "purple", RB: "purple",
    GK: "default",
};

function getAge(dateOfBirth: string) {
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function PlayerCard({ player }: { player: Player }) {
    const { addPlayer, removePlayer, isSelected, selectedPlayers } = useCompareStore();
    const selected = isSelected(player.id);
    const canAdd = selectedPlayers.length < 3;
    const latestStats = player.stats?.[0];

    function handleCompare() {
        if (selected) removePlayer(player.id);
        else if (canAdd) addPlayer(player);
    }

    return (
        <div style={{
            background: "var(--bg-card)",
            border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transition: "border-color 0.15s, transform 0.15s",
            cursor: "default",
        }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = selected ? "var(--primary)" : "var(--border-hover)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = selected ? "var(--primary)" : "var(--border)")}
        >
            {/* Header */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                    width: 52, height: 52, borderRadius: "var(--radius-md)",
                    background: "var(--bg-hover)", overflow: "hidden", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {player.photoUrl ? (
                        <img
                            src={player.photoUrl}
                            alt={`${player.firstName} ${player.lastName}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div style={{
                            width: "100%", height: "100%", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 700, color: "var(--primary)",
                            background: "var(--primary-dim)",
                        }}>
                            {player.firstName[0]}{player.lastName[0]}
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}>
                        {player.firstName} {player.lastName}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <Badge color={POSITION_COLORS[player.position] || "default"}>
                            {player.position}
                        </Badge>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            {getAge(player.dateOfBirth)} años
                        </span>
                    </div>
                </div>
            </div>

            {/* Team */}
            {player.team && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    {player.team.logoUrl && (
                        <img src={player.team.logoUrl} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
                    )}
                    {player.team.name}
                </div>
            )}

            {/* Stats */}
            {latestStats && (
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8, padding: "10px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                }}>
                    {[
                        { label: "Goles", value: latestStats.goals },
                        { label: "Asist.", value: latestStats.assists },
                        { label: "PJ", value: latestStats.matchesPlayed },
                    ].map(stat => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Nationality */}
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {player.nationality}
            </div>

            {/* Compare button */}
            <button
                onClick={handleCompare}
                disabled={!selected && !canAdd}
                style={{
                    width: "100%", padding: "8px 0",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13, fontWeight: 600,
                    background: selected ? "var(--primary-dim)" : "transparent",
                    color: selected ? "var(--primary)" : "var(--text-muted)",
                    border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                    opacity: (!selected && !canAdd) ? 0.4 : 1,
                    transition: "all 0.15s",
                }}
            >
                {selected ? "Quitar del comparador" : "Agregar al comparador"}
            </button>
        </div>
    );
}