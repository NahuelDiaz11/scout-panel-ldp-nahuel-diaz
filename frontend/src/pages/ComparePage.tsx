import { useCompareStore } from "../store/useCompareStore";
import { useComparePlayers, useSeasons } from "../hooks/usePlayers";
import { useState, useEffect, useRef } from "react";
import { RadarComparison } from "../components/players/RadarComparison";
import { StatsTable } from "../components/players/StatsTable";
import { SeasonBarChart } from "../components/players/SeasonBarChart";
import { useNavigate } from "react-router-dom";
import HeatmapField from "../components/players/HeatmapField";
import { ArrowLeft, Table, FileText, Sparkles, Bot } from "lucide-react";
import { ErrorState } from "../components/ui/ErrorState";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";

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

// ── HEADER PRINCIPAL DEL COMPARADOR (FOTOS RECTANGULARES) ──
function PlayerVSHeader({ player, align = "left" }: { player: any; align?: "left" | "right" }) {
  const isRight = align === "right";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 24,
      flexDirection: isRight ? "row-reverse" : "row",
      textAlign: isRight ? "right" : "left",
      flexWrap: "wrap", justifyContent: "center"
    }}>
      <div style={{
        width: 110, height: 110,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}>
        {player.photoUrl ? (
          <img
            src={player.photoUrl} alt={player.firstName}
            style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0px 10px 10px rgba(0,0,0,0.5))" }}
            referrerPolicy="no-referrer"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: C.muted }}>
            {player.firstName?.[0]}{player.lastName?.[0]}
          </div>
        )}
      </div>
      <div>
        <h2 style={{
          fontSize: 32, fontWeight: 900, color: C.text,
          margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 12,
          justifyContent: isRight ? "flex-end" : "flex-start",
          letterSpacing: "-0.5px"
        }}>
          {player.flagUrl && (
            <img
              src={player.flagUrl} alt={player.nationality}
              style={{ width: 26, height: 18, objectFit: "cover", borderRadius: 3 }}
              referrerPolicy="no-referrer"
            />
          )}
          <span>{player.firstName} {player.lastName}</span>
        </h2>

        <div style={{
          fontSize: 15, color: C.muted, display: "flex", alignItems: "center", gap: 10,
          justifyContent: isRight ? "flex-end" : "flex-start", flexWrap: "wrap"
        }}>
          <span style={{ color: C.primary, fontWeight: 800, textTransform: "uppercase" }}>{player.position}</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ fontWeight: 600 }}>{getAge(player.dateOfBirth)} años</span>
          {player.team?.name && (
            <>
              <span style={{ opacity: 0.3 }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                {player.team.logoUrl && (
                  <img src={player.team.logoUrl} alt={player.team.name} style={{ width: 20, height: 20, objectFit: "contain" }} referrerPolicy="no-referrer" />
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

  const [selectedSeason, setSelectedSeason] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const headerRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const { data, isLoading, isError } = useComparePlayers(ids, selectedSeason);
  const players = data?.data || [];

  const { data: seasonsData } = useSeasons();
  const seasons = seasonsData?.data || [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isThreePlayers = players.length === 3;

  const handleDownloadExcel = () => {
    exportToExcel(players, "comparativa_jugadores");
  };

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      exportToPDF(reportRef.current, "reporte_scouting");
    }
  };

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const handleGenerateAIReport = async () => {
    setIsGeneratingAI(true);
    setAiReport(null);

    try {

      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/ai/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          players: players.filter(Boolean)
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAiReport(data.report);
      } else {
        throw new Error(data.error || "Error desconocido al generar el reporte");
      }

    } catch (error) {
      console.error("Hubo un fallo al conectar con la IA:", error);
      setAiReport("⚠️ Ups, hubo un problema de conexión al intentar generar el análisis con Inteligencia Artificial. Por favor, revisa que el backend esté funcionando o inténtalo de nuevo.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  if (selectedPlayers.length < 2) {
    return (
      <div style={{ textAlign: "center", padding: 80, fontFamily: "'Nunito Sans', sans-serif" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚽</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Selecciona al menos 2 jugadores</div>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Vuelve a la lista y agrega jugadores para comparar</p>
        <button onClick={() => navigate("/")} style={{ padding: "10px 24px", borderRadius: 6, background: C.primary, color: "#0F0F0F", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
          Ver jugadores
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: 80, color: C.muted, fontFamily: "'Nunito Sans', sans-serif" }}>Cargando comparación...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: "40px clamp(16px, 4vw, 40px)", maxWidth: 600, margin: "0 auto" }}>
        <ErrorState
          title="Error al cargar la comparación"
          message="No pudimos conectarnos con el servidor para traer los datos de los jugadores."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const summaryRows = [
    { label: "Altura", getValue: (p: any) => p.height ?? "1.80m" },
    { label: "Pie Hábil", getValue: (p: any) => p.preferredFoot ?? "Derecho" },
    { label: "Partidos Jugados", getValue: (p: any) => p.stats?.reduce((acc: number, s: any) => acc + s.matchesPlayed, 0) || 0 },
    { label: "Goles Totales", getValue: (p: any) => p.stats?.reduce((acc: number, s: any) => acc + s.goals, 0) || 0 },
    {
      label: "Valor de Mercado",
      getValue: (p: any) => p.marketValue ? `€ ${(p.marketValue / 1000000).toFixed(1)}M` : "—"
    }
  ];

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", minHeight: "100vh", padding: "0 clamp(16px, 4vw, 40px)", paddingBottom: 80 }}>

      {/* ── Barra de Acciones Unificada ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 0",
        gap: 16,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 0", background: "transparent",
              border: "none", color: C.muted, cursor: "pointer",
              fontSize: 14, fontWeight: 700, transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.text}
            onMouseLeave={(e) => e.currentTarget.style.color = C.muted}
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Volver
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 700 }}>Temporada:</span>
            <select
              value={selectedSeason || ""}
              onChange={(e) => setSelectedSeason(e.target.value ? Number(e.target.value) : undefined)}
              style={{
                background: C.surface, color: C.text, border: `1px solid ${C.border}`,
                padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 700,
                outline: "none", cursor: "pointer"
              }}
            >
              <option value="">Todas las temporadas</option>
              {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleGenerateAIReport}
            disabled={isGeneratingAI || players.length < 2}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
              background: "rgba(117, 51, 252, 0.1)", color: C.purple,
              border: `1px solid rgba(117, 51, 252, 0.3)`, borderRadius: 6,
              fontSize: 13, fontWeight: 800, cursor: isGeneratingAI ? "wait" : "pointer",
              transition: "all 0.2s"
            }}
          >
            {isGeneratingAI ? <Bot size={16} className="animate-pulse" /> : <Sparkles size={16} />}
            {isGeneratingAI ? "Analizando..." : "Análisis IA"}
          </button>
          <button onClick={handleDownloadExcel} style={btnDownloadStyle}>
            <Table size={16} /> Excel
          </button>
          <button onClick={handleDownloadPDF} style={btnDownloadStyle}>
            <FileText size={16} /> PDF
          </button>
          <button onClick={() => clearPlayers()} style={btnClearStyle}>
            Limpiar comparador
          </button>
        </div>
      </div>

      <div ref={reportRef} style={{ background: C.bg, padding: "1px 0" }}>

        {/* ── Header VS (Con Textura y Spotlight) AHORA DEL MISMO ANCHO ── */}
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "relative",
            overflow: "hidden",
            background: C.card,
            backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "40px clamp(16px, 4vw, 40px)",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              background: `radial-gradient(
                        1000px circle at ${mousePos.x}px ${mousePos.y}px, 
                        rgba(0, 224, 148, 0.05), 
                        transparent 40%
                    )`,
              pointerEvents: "none"
            }}
          />

          <div style={{
            position: "relative", zIndex: 1,
            display: isThreePlayers && !isMobile ? "grid" : "flex",
            flexDirection: isThreePlayers && isMobile ? "column" : "row",
            gridTemplateColumns: isThreePlayers && !isMobile ? "1fr auto 1fr auto 1fr" : undefined,
            alignItems: "center",
            justifyContent: "center",
            gap: isThreePlayers && !isMobile ? "clamp(12px, 2vw, 24px)" : "clamp(16px, 4vw, 60px)",
            width: "100%", maxWidth: 1200,
            flexWrap: "wrap"
          }}>
            {/* Jugador 0 */}
            {players[0] && (
              <div style={{ flex: "1 1 min-content" }}>
                <PlayerVSHeader player={players[0]} align={isMobile ? "left" : "right"} />
              </div>
            )}

            {/* VS Oculto en móviles */}
            {!isMobile && (
              <div style={{ fontSize: 20, fontWeight: 900, color: C.muted, background: C.surface, padding: "12px 20px", borderRadius: 30, border: `1px solid ${C.border}` }}>VS</div>
            )}

            {/* Jugador 1 */}
            {players[1] && (
              <div style={{ flex: "1 1 min-content" }}>
                <PlayerVSHeader player={players[1]} align="left" />
              </div>
            )}

            {/* Jugador 2 (Si existe) */}
            {players[2] && (
              <>
                {/* Segundo VS Oculto en móviles */}
                {!isMobile && (
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.muted, background: C.surface, padding: "12px 20px", borderRadius: 30, border: `1px solid ${C.border}` }}>VS</div>
                )}
                <div style={{ flex: "1 1 min-content" }}>
                  <PlayerVSHeader player={players[2]} align="left" />
                </div>
              </>
            )}
          </div>
        </div>
        {/* SECCIÓN DE REPORTE IA */}
        {(isGeneratingAI || aiReport) && (
          <div style={{
            background: "rgba(117, 51, 252, 0.03)",
            border: `1px solid rgba(117, 51, 252, 0.2)`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Sparkles color={C.purple} size={20} />
              <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 800 }}>Veredicto Scout AI</h3>
            </div>

            {isGeneratingAI ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ height: 12, background: C.border, borderRadius: 6, width: "100%", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                <div style={{ height: 12, background: C.border, borderRadius: 6, width: "90%", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                <div style={{ height: 12, background: C.border, borderRadius: 6, width: "60%", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              </div>
            ) : (
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
                {aiReport}
              </p>
            )}
          </div>
        )}
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

        {/* Cierra la zona del reporte */}
      </div>

    </div>
  );
}

const btnDownloadStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
  background: "rgba(0, 224, 148, 0.1)", color: "#00E094",
  border: "1px solid rgba(0, 224, 148, 0.2)", borderRadius: 6,
  fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
};

const btnClearStyle: React.CSSProperties = {
  padding: "8px 16px", background: "transparent", border: "1px solid #242424",
  color: "#F2F2F2", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700,
  transition: "all 0.2s"
};