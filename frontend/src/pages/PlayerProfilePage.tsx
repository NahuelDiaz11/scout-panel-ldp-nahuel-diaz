import { useParams, useNavigate } from "react-router-dom";
import { usePlayerStats } from "../hooks/usePlayers";
import { useCompareStore } from "../store/useCompareStore";
import { StatCircle } from "../components/players/StatCircle";
import { PlayerStatsTable } from "../components/players/PlayerStatsTable";
import HeatmapField from "../components/players/HeatmapField";
import { RadarComparison } from "../components/players/RadarComparison";

const C = {
    bg: "#0F0F0F",
    card: "#161616",
    surface: "#1C1C1C",
    border: "#242424",
    text: "#F2F2F2",
    muted: "#8C8C8C",
    primary: "#00E094",
    purple: "#7533FC",
};

function getAge(dateOfBirth: string) {
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function PlayerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // jugador + percentiles
    const { data, isLoading, isError } = usePlayerStats(Number(id));
    const { addPlayer, removePlayer, isSelected, selectedPlayers } = useCompareStore();

    const player = data?.data?.player;
    const percentiles = data?.data?.percentiles;

    const selected = player ? isSelected(player.id) : false;
    const canAdd = selectedPlayers.length < 3;

    if (isLoading) {
        return <div style={{ textAlign: "center", padding: 80, color: C.muted }}>Loading player...</div>;
    }

    if (isError || !player) {
        return (
            <div style={{ textAlign: "center", padding: 80 }}>
                <div style={{ color: C.muted, marginBottom: 16 }}>Player not found</div>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "8px 20px", background: C.primary, color: "#0F0F0F",
                        borderRadius: 6, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    }}
                >
                    Back to list
                </button>
            </div>
        );
    }

    const latestStats = player.stats?.[0];

    const statCircles = percentiles && latestStats ? [
        { label: "Shots On Target", value: latestStats.shotsOnTarget, pct: percentiles.shotsOnTarget },
        { label: "Goal Conversion", value: latestStats.goals, pct: percentiles.goals },
        { label: "Offensive Duels Won", value: latestStats.aerialDuelsWon, pct: percentiles.aerialDuelsWon },
        { label: "Aerial Duels Won", value: latestStats.aerialDuelsWon, pct: percentiles.aerialDuelsWon },
    ] : [];

    let safeGrid = latestStats?.heatmapGrid;
    if (typeof safeGrid === 'string') {
        try { safeGrid = JSON.parse(safeGrid); } 
        catch (e) { safeGrid = null; }
    }

    const totalMatches = player.stats?.reduce((acc: number, s: any) => acc + s.matchesPlayed, 0) || 0;
    const totalGoals = player.stats?.reduce((acc: number, s: any) => acc + s.goals, 0) || 0;

    return (
        <div style={{ fontFamily: "'Nunito Sans', sans-serif", paddingBottom: 80 }}>

            {/* ── 1. HERO HEADER (Responsive) ── */}
            <div style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                padding: "24px 32px", marginBottom: 24, display: "flex", 
                alignItems: "center", justifyContent: "space-between", gap: 24,
                flexWrap: "wrap"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "transparent", border: "none", color: C.muted,
                            cursor: "pointer", fontSize: 20, padding: "4px 8px", borderRadius: 6,
                        }}
                    >
                        ←
                    </button>

                    <div style={{
                        width: 72, height: 72, borderRadius: "50%", background: C.surface,
                        overflow: "hidden", border: `2px solid ${C.border}`, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        {player.photoUrl ? (
                            <img src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                            <div style={{ fontSize: 22, fontWeight: 800, color: C.muted }}>
                                {player.firstName?.[0]}{player.lastName?.[0]}
                            </div>
                        )}
                    </div>

                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                            {player.flagUrl && (
                                <img 
                                    src={player.flagUrl} 
                                    alt={player.nationality} 
                                    style={{ width: 22, height: 16, objectFit: "cover", borderRadius: 2 }} 
                                    referrerPolicy="no-referrer"
                                />
                            )}
                            <div style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>
                                {player.firstName} {player.lastName}
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, fontSize: 13, flexWrap: "wrap" }}>
                            <span style={{ background: "var(--primary-dim, rgba(0,224,148,0.12))", color: C.primary, padding: "2px 8px", borderRadius: 99, fontWeight: 700, fontSize: 12 }}>
                                {player.position}
                            </span>
                            <span style={{ color: C.muted }}>{getAge(player.dateOfBirth)} years</span>
                            <span style={{ color: C.muted }}>Professional</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    {player.team && (
                        <div style={{ 
                            background: C.surface, border: `1px solid ${C.border}`, 
                            borderRadius: 10, padding: "12px 20px", 
                            display: "flex", alignItems: "center", gap: 12 
                        }}>
                            {player.team.logoUrl && (
                                <img 
                                    src={player.team.logoUrl} 
                                    alt={player.team.name} 
                                    style={{ width: 32, height: 32, objectFit: "contain" }} 
                                    referrerPolicy="no-referrer"
                                />
                            )}
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{player.team.name}</div>
                                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Liga Profesional de Fútbol</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            if (selected) removePlayer(player.id);
                            else if (canAdd) addPlayer(player);
                        }}
                        disabled={!selected && !canAdd}
                        style={{
                            padding: "10px 24px", background: selected ? C.primary : "transparent",
                            color: selected ? "#0F0F0F" : C.primary, border: `1px solid ${C.primary}`,
                            borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: "pointer",
                            opacity: !selected && !canAdd ? 0.4 : 1, transition: "all 0.15s",
                        }}
                    >
                        {selected ? "Remove from compare" : "Compare"}
                    </button>
                </div>
            </div>

            {/* ── 2. INFO & PERFORMANCE  ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                gap: 24,
                marginBottom: 24,
            }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                            Player information
                        </div>
                        {[
                            { label: "Edad", value: `${getAge(player.dateOfBirth)} años` },
                            { label: "Altura", value: player.height ?? "1.80m" },
                            { label: "Pie Hábil", value: player.preferredFoot ?? "Derecho" },
                            { label: "Partidos Jugados", value: totalMatches },
                            { label: "Goles Totales", value: totalGoals },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                                <span style={{ color: C.muted }}>{label}</span>
                                <span style={{ color: C.text, fontWeight: 600 }}>{value}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                            Market value
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                            <span style={{ color: C.muted }}>Valor Transfermarkt</span>
                            {/* ACÁ ACTUALIZAMOS EL VALOR */}
                            <span style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>
                                {player.marketValue ? `€ ${(player.marketValue / 1000000).toFixed(1)}M` : "—"}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                        Performance
                    </div>
                    {latestStats ? (
                        <div>
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{latestStats.season.name} · Liga Profesional de Fútbol</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 50px 60px", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.muted, fontWeight: 700 }}>
                                <span>Competition</span><span style={{ textAlign: "center" }}>M.P</span><span style={{ textAlign: "center" }}>Min.</span><span style={{ textAlign: "center" }}>G</span><span style={{ textAlign: "center" }}>As</span>
                            </div>
                            {player.stats.map((stat) => (
                                <div key={stat.id} style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 50px 60px", gap: 8, padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.text }}>
                                    <span style={{ color: C.muted }}>Liga Profesional</span><span style={{ textAlign: "center" }}>{stat.matchesPlayed}</span><span style={{ textAlign: "center" }}>{stat.minutesPlayed}'</span><span style={{ textAlign: "center", color: C.primary, fontWeight: 700 }}>{stat.goals}</span><span style={{ textAlign: "center" }}>{stat.assists}</span>
                                </div>
                            ))}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 50px 60px", gap: 8, padding: "10px 0", fontSize: 13, fontWeight: 700, color: C.text }}>
                                <span>Total</span><span style={{ textAlign: "center" }}>{totalMatches}</span><span style={{ textAlign: "center" }}>{player.stats.reduce((a, s) => a + s.minutesPlayed, 0)}'</span><span style={{ textAlign: "center", color: C.primary }}>{totalGoals}</span><span style={{ textAlign: "center" }}>{player.stats.reduce((a, s) => a + s.assists, 0)}</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: C.muted, fontSize: 13 }}>No stats available</div>
                    )}
                </div>
            </div>

            {/* ── 3. RADAR & HEATMAP JUNTOS ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                gap: 24,
                marginBottom: 24,
            }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                        Atributos del Jugador
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center" }}>
                        <RadarComparison players={[player]} colors={[C.primary]} />
                    </div>
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                        Total Actions (Heatmap)
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center", width: "100%", overflowX: "auto" }}>
                        <HeatmapField grid={safeGrid} width={880} height={480} />
                    </div>
                </div>
            </div>

            {/* ── 4. STATISTICS CIRCLES ── */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                        Statistics
                    </span>
                    <span style={{ fontSize: 11, color: C.muted }}>{latestStats?.season.name} · Liga Profesional</span>
                </div>
                {latestStats && (
                    <div style={{
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: 24, padding: "16px 0" 
                    }}>
                        {statCircles.map((stat) => (
                            <StatCircle key={stat.label} label={stat.label} pct={stat.pct} color={C.purple} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── 5. TABLA HISTÓRICA ── */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 3, height: 14, background: C.primary, borderRadius: 2, display: "inline-block" }} />
                    Stats by season
                </div>
                <div style={{ overflowX: "auto" }}>
                    <PlayerStatsTable stats={player.stats} />
                </div>
            </div>
        </div>
    );
}