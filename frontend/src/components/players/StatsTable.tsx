import React from "react";
import type { Player } from "../../types";

const C = {
  border: "#242424",
  text: "#F2F2F2",
  muted: "#8C8C8C",
  green: "#00E094", // [cite: 50]
  orange: "#F5A623",
  red: "#E84040",
};

const METRICS = [
  { key: "recoveries",        label: "Recoveries" },
  { key: "defensiveActions",  label: "Successful Defensive Actions" },
  { key: "aerialDuelsWon",    label: "Aerial Duels Won" },
  { key: "successfulPasses",  label: "Successful Passes" },
  { key: "passAccuracy",      label: "% Successful Passes" },
  { key: "defensiveDuelsWon", label: "Defensive Duels Won" },
  { key: "xA",                label: "Expected Assists (xA)" },
  { key: "assists",           label: "Assists" },
  { key: "xG",                label: "Expected Goals (xG)" },
  { key: "goals",             label: "Goals" },
];

function dotColor(pct: number) {
  if (pct >= 70) return C.green;
  if (pct >= 40) return C.orange;
  return C.red;
}

export function StatsTable({ players, colors }: { players: Player[], colors: string[] }) {
  const colCount = players.length;

  return (
    // [cite: 52] Tipografía requerida
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
        {players.map((p) => (
          <div key={p.id} style={{ fontSize: 13, color: C.text, fontWeight: 600, textAlign: "center" }}>
            {p.firstName} {p.lastName}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {METRICS.map((metric, rowIdx) => (
        <div key={metric.key} style={{ 
            display: "grid", 
            gridTemplateColumns: `2fr repeat(${colCount}, 1fr)`, 
            padding: "16px 0",
            borderBottom: rowIdx !== METRICS.length - 1 ? `1px solid ${C.border}` : "none"
        }}>
          <div style={{ fontSize: 13, color: C.text, display: "flex", alignItems: "center" }}>
            {metric.label}
          </div>

          {players.map((player) => {
            const s = player.stats?.[0] as any;
            
            const rawValue = s ? (s[metric.key] ?? 0) : 0;
            
            const pct = s ? (s[`${metric.key}Percentile`] ?? 0) : 0; 

            return (
              <div key={player.id} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {/* El punto de color ahora usa el percentil real */}
                <span style={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: "50%", 
                    background: dotColor(pct) 
                }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                  {rawValue} 
                  {/* Mostramos el percentil en gris al lado del valor (ej: 15 (85th)) */}
                  <span style={{ color: C.muted, fontWeight: 400, marginLeft: 4 }}>
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
         <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>
             Percentile average 
             <span style={{
                 color: C.muted, 
                 fontWeight:400, 
                 border: `1px solid ${C.border}`, 
                 borderRadius: "50%", 
                 padding: "0 5px", 
                 fontSize: 10,
                 marginLeft: 4
             }}>i</span>
         </span>
      </div>
    </div>
  );
}