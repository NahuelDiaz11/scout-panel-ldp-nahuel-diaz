import type { PlayerStats } from "../../types";

const C = { border: "#242424", text: "#F2F2F2", muted: "#8C8C8C", primary: "#00E094" };

const COLUMNS = [
    { key: "season", label: "Season", render: (s: PlayerStats) => s.season.name },
    { key: "matchesPlayed", label: "MP", render: (s: PlayerStats) => s.matchesPlayed },
    { key: "minutesPlayed", label: "Min", render: (s: PlayerStats) => `${s.minutesPlayed}'` },
    { key: "goals", label: "G", render: (s: PlayerStats) => s.goals },
    { key: "assists", label: "A", render: (s: PlayerStats) => s.assists },
    { key: "xG", label: "xG", render: (s: PlayerStats) => s.xG.toFixed(1) },
    { key: "xA", label: "xA", render: (s: PlayerStats) => s.xA.toFixed(1) },
    { key: "shotsOnTarget", label: "SOT", render: (s: PlayerStats) => s.shotsOnTarget },
    { key: "passAccuracy", label: "Pass%", render: (s: PlayerStats) => `${s.passAccuracy.toFixed(0)}%` },
    { key: "yellowCards", label: "YC", render: (s: PlayerStats) => s.yellowCards },
    { key: "redCards", label: "RC", render: (s: PlayerStats) => s.redCards },
];

export function PlayerStatsTable({ stats }: { stats: PlayerStats[] }) {
    if (!stats.length) {
        return <div style={{ color: C.muted, fontSize: 13 }}>No stats available</div>;
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {COLUMNS.map((col) => (
                            <th key={col.key} style={{
                                padding: "8px 12px", textAlign: "center",
                                color: C.muted, fontWeight: 700,
                                fontSize: 11, whiteSpace: "nowrap",
                            }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, i) => (
                        <tr key={stat.id} style={{
                            borderBottom: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
                        }}>
                            {COLUMNS.map((col) => (
                                <td key={col.key} style={{
                                    padding: "10px 12px", textAlign: "center",
                                    color: col.key === "goals" || col.key === "assists"
                                        ? C.primary : C.text,
                                    fontWeight: col.key === "goals" || col.key === "assists"
                                        ? 700 : 400,
                                }}>
                                    {col.render(stat) as string}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}