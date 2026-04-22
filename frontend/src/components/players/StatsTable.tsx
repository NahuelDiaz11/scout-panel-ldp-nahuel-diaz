import type { Player } from "../../types";

const C = {
  border: "#242424",
  text: "#F2F2F2",
  muted: "#8C8C8C",
  green: "#00E094",
  orange: "#F5A623",
  red: "#E84040",
};

const METRICS = [
  { key: "recoveries", label: "Recuperaciones" },
  { key: "defensiveActions", label: "Acciones defensivas exitosas" },
  { key: "aerialDuelsWon", label: "Duelos aéreos ganados" },
  { key: "successfulPasses", label: "Pases completados" },
  { key: "passAccuracy", label: "% de precisión de pases" },
  { key: "defensiveDuelsWon", label: "Duelos defensivos ganados" },
  { key: "xA", label: "Asistencias esperadas (xA)" },
  { key: "assists", label: "Asistencias" },
  { key: "xG", label: "Goles esperados (xG)" },
  { key: "goals", label: "Goles" },
];

function dotColor(pct: number) {
  if (pct >= 70) return C.green;
  if (pct >= 40) return C.orange;
  return C.red;
}

export function StatsTable({ players, colors }: { players: Player[], colors: string[] }) {
  const colCount = players.length;

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* Table Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `2fr repeat(${colCount}, 1fr)`,
        paddingBottom: 16,
        borderBottom: `1px solid ${C.border}`,
        marginBottom: 8
      }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Metric</div>
        {players.map((p, i) => (
          <div key={p.id} style={{
            fontSize: 13,
            color: colors[i], 
            fontWeight: 700,
            textAlign: "center"
          }}>
            {p.lastName}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {METRICS.map((metric, rowIdx) => (
        <div key={metric.key} style={{
          display: "grid",
          gridTemplateColumns: `2fr repeat(${colCount}, 1fr)`,
          padding: "16px 0",
          borderBottom: rowIdx !== METRICS.length - 1 ? `1px solid ${C.border}` : "none",
          alignItems: "center"
        }}>
          {/* Nombre de la Métrica */}
          <div style={{ fontSize: 13, color: C.text, display: "flex", alignItems: "center" }}>
            {metric.label}
          </div>

          {/* Valores de los Jugadores */}
          {players.map((player) => {
            const s = player.stats?.[0] as any;
            const pcts = (player as any).percentiles;

            const rawValue = s ? (s[metric.key] ?? 0) : 0;
            const pct = pcts ? (pcts[metric.key] ?? 0) : 0;

            return (
              <div key={player.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}>
                {/* Indicador de color según percentil */}
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: dotColor(pct)
                }} />

                {/* Valor Real + Percentil */}
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                  {rawValue}
                  <span style={{ color: C.muted, fontWeight: 400, marginLeft: 4, fontSize: 11 }}>
                    ({pct}th)
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {/* Legend Footer */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 11, color: C.muted }}>
          * Rendimiento por percentil relativo a jugadores.
        </span>
      </div>
    </div>
  );
}