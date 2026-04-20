import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Player } from "../../types";

function getLatestStats(player: Player) {
    return player.stats?.[0] ?? null;
}

function normalize(value: number, max: number) {
    return Math.min(100, Math.round((value / max) * 100));
}

export function RadarComparison({ players, colors }: { players: Player[], colors: string[] }) {
    const metrics = [
        { key: "recoveries", label: "Recoveries", max: 150 },
        { key: "goals", label: "Goals", max: 30 },
        { key: "xG", label: "Expected Goals\n(xG)", max: 25 },
        { key: "assists", label: "Assists", max: 20 },
        { key: "xA", label: "Expected Assists\n(xA)", max: 15 },
        { key: "defensiveDuelsWon", label: "% Defensive\nDuels Won", max: 100 },
        { key: "defensiveDuelsWonRaw", label: "Defensive Duels\nWon", max: 100 },
        { key: "passAccuracy", label: "% Successful\nPasses", max: 100 },
        { key: "successfulPasses", label: "Successful Passes", max: 150 },
        { key: "aerialDuelsWonPct", label: "% Aerial\nDuels Won", max: 100 },
        { key: "aerialDuelsWon", label: "Aerial Duels\nWon", max: 60 },
        { key: "defensiveActions", label: "Successful Defensive\nActions", max: 100 },
    ];

    const data = metrics.map(({ key, label, max }) => {
        const entry: Record<string, string | number> = { metric: label };
        players.forEach((player) => {
            const stats = getLatestStats(player) as any;
            entry[`${player.firstName} ${player.lastName}`] = stats
                ? normalize(stats[key] ?? 0, max)
                : 0;
        });
        return entry;
    });

    return (
        <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                <PolarGrid stroke="#2A2A2A" strokeWidth={1} />
                <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#D1D1D1", fontSize: 11, fontFamily: "Nunito Sans", fontWeight: 600 }}
                />
                <Tooltip
                    contentStyle={{ background: "#1C1C1C", border: "1px solid #242424", borderRadius: 8, color: "#FFF" }}
                />
                {players.map((player, i) => (
                    <Radar
                        key={player.id}
                        name={`${player.firstName} ${player.lastName}`}
                        dataKey={`${player.firstName} ${player.lastName}`}
                        stroke={colors[i]}
                        fill={colors[i]}
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                ))}
            </RadarChart>
        </ResponsiveContainer>
    );
}