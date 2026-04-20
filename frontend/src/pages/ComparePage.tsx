import { useCompareStore } from "../store/useCompareStore";
import { useComparePlayers } from "../hooks/usePlayers";
import { RadarComparison } from "../components/players/RadarComparison";
import { StatsTable } from "../components/players/StatsTable";
import { SeasonBarChart } from "../components/players/SeasonBarChart";
import { useNavigate } from "react-router-dom";

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

function PlayerVSHeader({
  player,
  align = "left",
}: {
  player: any;
  align?: "left" | "right";
}) {
  const isRight = align === "right";
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexDirection: isRight ? "row-reverse" : "row",
      textAlign: isRight ? "right" : "left",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: C.surface, overflow: "hidden",
        border: `2px solid ${C.border}`, flexShrink: 0,
      }}>
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.firstName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: C.muted,
          }}>
            {player.firstName?.[0]}{player.lastName?.[0]}
          </div>
        )}
      </div>
      <div>
        <h2 style={{
          fontSize: 20, fontWeight: 800, color: C.text,
          margin: "0 0 4px 0", display: "flex",
          alignItems: "center", gap: 8,
          flexDirection: isRight ? "row-reverse" : "row",
        }}>
          {player.firstName} {player.lastName}
        </h2>
        <div style={{
          fontSize: 13, color: C.muted,
          display: "flex", alignItems: "center", gap: 8,
          justifyContent: isRight ? "flex-end" : "flex-start",
        }}>
          <span style={{ color: C.primary, fontWeight: 800 }}>{player.position}</span>
          <span>|</span>
          <span>{getAge(player.dateOfBirth)} years</span>
          {player.team?.name && (
            <>
              <span>|</span>
              <span>{player.team.name}</span>
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

  // ── Empty state ──────────────────────────────────────────────
  if (selectedPlayers.length < 2) {
    return (
      <div style={{
        textAlign: "center", padding: 80,
        fontFamily: "'Nunito Sans', sans-serif",
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚽</div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: C.text, marginBottom: 8,
        }}>
          Select at least 2 players
        </div>
        <p style={{
          fontSize: 14, color: C.muted, marginBottom: 24,
        }}>
          Go back to the list and add players to compare
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 24px",
            borderRadius: 6,
            background: C.primary,
            color: "#0F0F0F",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          View players
        </button>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{
        textAlign: "center", padding: 80,
        color: C.muted, fontFamily: "'Nunito Sans', sans-serif",
      }}>
        Loading comparison...
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Nunito Sans', sans-serif",
      background: C.bg,
      minHeight: "100vh",
      padding: "24px 40px",
      paddingBottom: 80,
    }}>

      {/* ── Header VS ── */}
      <div style={{
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
        padding: "24px 40px",
        margin: "-24px -40px 32px -40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          gap: 60, width: "100%", maxWidth: 1000,
        }}>
          {players[0] && (
            <div style={{ flex: 1 }}>
              <PlayerVSHeader player={players[0]} align="right" />
            </div>
          )}
          <div style={{
            fontSize: 16, fontWeight: 900, color: C.muted,
            background: C.surface, padding: "8px 16px",
            borderRadius: 20, flexShrink: 0,
          }}>
            VS
          </div>
          {players[1] && (
            <div style={{ flex: 1 }}>
              <PlayerVSHeader player={players[1]} align="left" />
            </div>
          )}
          {/* Tercer jugador si existe */}
          {players[2] && (
            <>
              <div style={{
                fontSize: 16, fontWeight: 900, color: C.muted,
                background: C.surface, padding: "8px 16px",
                borderRadius: 20, flexShrink: 0,
              }}>
                VS
              </div>
              <div style={{ flex: 1 }}>
                <PlayerVSHeader player={players[2]} align="left" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Botón volver ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button
          onClick={() => { clearPlayers(); navigate("/"); }}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.text,
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Back to list
        </button>
      </div>

      {/* ── Radar + Tabla ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 32,
      }}>
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "32px 0",
        }}>
          <RadarComparison players={players} colors={PLAYER_COLORS} />
        </div>
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "24px",
          overflowY: "auto",
          maxHeight: 600,
        }}>
          <StatsTable players={players} colors={PLAYER_COLORS} />
        </div>
      </div>

      {/* ── Season Evolution ── */}
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "24px",
      }}>
        <h3 style={{
          margin: "0 0 24px 0",
          fontSize: 14, color: C.text,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          Season Evolution
        </h3>
        <SeasonBarChart players={players} colors={PLAYER_COLORS} />
      </div>
    </div>
  );
}