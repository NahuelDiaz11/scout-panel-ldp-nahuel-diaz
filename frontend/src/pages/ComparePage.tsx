import React from "react";
import { useCompareStore } from "../store/useCompareStore";
import { useComparePlayers } from "../hooks/usePlayers";
import { RadarComparison } from "../components/players/RadarComparison";
import { StatsTable } from "../components/players/StatsTable";
import { SeasonBarChart } from "../components/players/SeasonBarChart";
import { useNavigate } from "react-router-dom";
import HeatmapField from "../components/players/HeatmapField";

const C = {
  bg: "#0F0F0F",
  card: "#161616",
  surface: "#1C1C1C",
  border: "#242424",
  text: "#F2F2F2",
  muted: "#8C8C8C",
  primary: "#00E094",
  blue: "#0C65D4",
  purple: "#8048FF",
  orange: "#DCA54B",
};

const PLAYER_COLORS = [C.purple, C.orange, C.primary];

function getAge(dateOfBirth: string) {
  const diff = Date.now() - new Date(dateOfBirth).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

// ── HEADER PRINCIPAL DEL COMPARADOR ──
function PlayerVSHeader({ player, align = "left" }: { player: any; align?: "left" | "right" }) {
  const isRight = align === "right";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      flexDirection: isRight ? "row-reverse" : "row",
      textAlign: isRight ? "right" : "left",
      flexWrap: "wrap", justifyContent: "center"
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: C.surface, overflow: "hidden",
        border: `2px solid ${C.border}`, flexShrink: 0,
      }}>
        {player.photoUrl ? (
          <img
            src={player.photoUrl} alt={player.firstName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            referrerPolicy="no-referrer"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: C.muted }}>
            {player.firstName?.[0]}{player.lastName?.[0]}
          </div>
        )}
      </div>
      <div>
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: C.text,
          margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 10,
          justifyContent: isRight ? "flex-end" : "flex-start" 
        }}>
          {player.flagUrl && (
            <img 
              src={player.flagUrl} alt={player.nationality} 
              style={{ width: 22, height: 16, objectFit: "cover", borderRadius: 2 }} 
              referrerPolicy="no-referrer" 
            />
          )}
          <span>{player.firstName} {player.lastName}</span>
        </h2>
        
        <div style={{
          fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 8,
          justifyContent: isRight ? "flex-end" : "flex-start", flexWrap: "wrap"
        }}>
          <span style={{ color: C.primary, fontWeight: 800 }}>{player.position}</span>
          <span>|</span>
          <span>{getAge(player.dateOfBirth)} years</span>
          {player.team?.name && (
            <>
              <span>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {player.team.logoUrl && (
                  <img src={player.team.logoUrl} alt={player.team.name} style={{ width: 16, height: 16, objectFit: "contain" }} referrerPolicy="no-referrer" />
                )}
                <span>{player.team.name}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ComparePage() {
  const { selectedPlayers, clearPlayers } = useCompareStore();
  const navigate = useNavigate();
  const ids = selectedPlayers.map((p) => p.id);

  const { data, isLoading } = useComparePlayers(ids);
  const players = data?.data || [];

  if (selectedPlayers.length < 2) {
    return (
      <div style={{ textAlign: "center", padding: 80, fontFamily: "'Nunito Sans', sans-serif" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚽</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Select at least 2 players</div>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Go back to the list and add players to compare</p>
        <button onClick={() => navigate("/")} style={{ padding: "10px 24px", borderRadius: 6, background: C.primary, color: "#0F0F0F", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
          View players
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: 80, color: C.muted, fontFamily: "'Nunito Sans', sans-serif" }}>Loading comparison...</div>;
  }

  const summaryRows = [
    { label: "Edad", getValue: (p: any) => `${getAge(p.dateOfBirth)} años` },
    { label: "Altura", getValue: (p: any) => p.height ?? "1.80m" },
    { label: "Pie Hábil", getValue: (p: any) => p.preferredFoot ?? "Derecho" },
    { label: "Partidos Jugados", getValue: (p: any) => p.stats?.reduce((acc: number, s: any) => acc + s.matchesPlayed, 0) || 0 },
    { label: "Goles Totales", getValue: (p: any) => p.stats?.reduce((acc: number, s: any) => acc + s.goals, 0) || 0 },
    { 
      label: "Valor de Mercado", 
      getValue: (p: any) => {
        return p.marketValue ? `€ ${(p.marketValue / 1000000).toFixed(1)}M` : "—";
      }
    }
  ];

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: C.bg, minHeight: "100vh", padding: "24px clamp(16px, 4vw, 40px)", paddingBottom: 80 }}>
      
      {/* ── Header VS ── */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: "24px clamp(16px, 4vw, 40px)",
        margin: "-24px calc(-1 * clamp(16px, 4vw, 40px)) 32px calc(-1 * clamp(16px, 4vw, 40px))",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(16px, 4vw, 60px)", width: "100%", maxWidth: 1000, flexWrap: "wrap" }}>
          {players[0] && <div style={{ flex: "1 1 min-content" }}><PlayerVSHeader player={players[0]} align="right" /></div>}
          <div style={{ fontSize: 16, fontWeight: 900, color: C.muted, background: C.surface, padding: "8px 16px", borderRadius: 20, flexShrink: 0 }}>VS</div>
          {players[1] && <div style={{ flex: "1 1 min-content" }}><PlayerVSHeader player={players[1]} align="left" /></div>}
          {players[2] && (
            <>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.muted, background: C.surface, padding: "8px 16px", borderRadius: 20, flexShrink: 0 }}>VS</div>
              <div style={{ flex: "1 1 min-content" }}><PlayerVSHeader player={players[2]} align="left" /></div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button onClick={() => { clearPlayers(); navigate("/"); }} style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          Back to list
        </button>
      </div>

      {/* ── 1. Resumen General ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
          Perfil General
        </div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 500 }}>
            <div style={{ display: "grid", gridTemplateColumns: `2fr repeat(${players.length}, 1fr)`, gap: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontWeight: 700 }}>
              <div>Característica</div>
              {players.map((p, i) => <div key={p.id} style={{ textAlign: "center", color: PLAYER_COLORS[i] }}>{p.lastName}</div>)}
            </div>
            {summaryRows.map((row, index) => (
              <div key={row.label} style={{ display: "grid", gridTemplateColumns: `2fr repeat(${players.length}, 1fr)`, gap: 16, padding: "14px 0", borderBottom: index !== summaryRows.length - 1 ? `1px solid ${C.border}` : "none", fontSize: 14, color: C.text }}>
                <div style={{ fontWeight: 600 }}>{row.label}</div>
                {players.map((p) => <div key={p.id} style={{ textAlign: "center", fontWeight: 700 }}>{row.getValue(p)}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Métricas Detalladas (Percentiles Solo) ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 32, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
          Métricas Detalladas (Percentiles)
        </div>
        <div style={{ overflowX: "auto", flex: 1, paddingRight: 8 }}>
          <StatsTable players={players} colors={PLAYER_COLORS} />
        </div>
      </div>

      {/* ── 3. Heatmaps ── */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 350px), 1fr))`, gap: 24, marginBottom: 32 }}>
        {players.map((player, i) => {
          const latestStats = player.stats?.[0];
          let safeGrid = latestStats?.heatmapGrid;
          if (typeof safeGrid === 'string') {
            try { safeGrid = JSON.parse(safeGrid); } catch (e) { safeGrid = null; }
          }
          return (
            <div key={player.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: PLAYER_COLORS[i], marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 3, height: 14, background: PLAYER_COLORS[i], borderRadius: 2, display: "inline-block" }} />
                {player.firstName} {player.lastName} — Zonas de Influencia
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", overflowX: "auto" }}>
                <HeatmapField grid={safeGrid} width={420} height={240} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. Radar y Barras Juntos ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 0", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 24px", marginBottom: 16, fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
            Comparación de Atributos
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <RadarComparison players={players} colors={PLAYER_COLORS} />
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 24, fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
            Evolución por Temporada (Goles / Asistencias)
          </div>
          <div style={{ flex: 1, overflowX: "auto", width: "100%", display: "flex", alignItems: "center" }}>
             <div style={{ minWidth: 400, width: "100%" }}>
               <SeasonBarChart players={players} colors={PLAYER_COLORS} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}