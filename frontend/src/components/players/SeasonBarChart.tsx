import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Player } from "../../types";
import { useState } from "react";

const C = { surface: "#1C1C1C", border: "#242424", text: "#F2F2F2", muted: "#8C8C8C" };

type StatKey = "goals" | "assists" | "xG" | "matchesPlayed" | "minutesPlayed";
const STAT_OPTIONS: { key: StatKey; label: string }[] = [
  { key: "goals",         label: "Goals" },
  { key: "assists",       label: "Assists" },
  { key: "xG",            label: "xG" },
  { key: "matchesPlayed", label: "Matches" },
  { key: "minutesPlayed", label: "Minutes" },
];

export function SeasonBarChart({ players, colors }: { players: Player[], colors: string[] }) {
  const [stat, setStat] = useState<StatKey>("goals");

  const allSeasons = Array.from(new Set(players.flatMap((p) => p.stats.map((s) => s.season.name)))).sort();

  const data = allSeasons.map((season) => {
    const entry: Record<string, string | number> = { season };
    players.forEach((player) => {
      const seasonStats = player.stats.find((s) => s.season.name === season) as any;
      entry[`${player.firstName} ${player.lastName}`] = seasonStats ? (seasonStats[stat] ?? 0) : 0;
    });
    return entry;
  });

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {STAT_OPTIONS.map(({ key, label }) => {
          const active = stat === key;
          return (
            <button
              key={key}
              onClick={() => setStat(key)}
              style={{
                padding: "6px 16px", fontSize: 12, fontWeight: 700, borderRadius: 6,
                border: `1px solid ${active ? C.text : C.border}`,
                background: active ? C.surface : "transparent",
                color: active ? C.text : C.muted,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 16, left: -12, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis dataKey="season" tick={{ fill: C.muted, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20, color: C.muted }} iconType="square" iconSize={8} />
          {players.map((player, i) => (
            <Bar key={player.id} dataKey={`${player.firstName} ${player.lastName}`} fill={colors[i]} radius={[3, 3, 0, 0]} maxBarSize={44} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}