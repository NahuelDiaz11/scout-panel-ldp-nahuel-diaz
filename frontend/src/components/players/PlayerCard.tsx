import { Link } from "react-router-dom";
import { useCompareStore } from "../../store/useCompareStore";
import type { Player } from "../../types";
import { useState, useRef } from "react";
import { Bookmark } from "lucide-react";
import { useShortlist } from "../../hooks/useShortlist";

const C = {
    primary: "#00E094",
    cardBg: "#161616",
    border: "#242424",
    text: "#F2F2F2",
    muted: "#8C8C8C",
};

export function PlayerCard({ player }: { player: Player }) {
    const { addPlayer, removePlayer, isSelected, selectedPlayers} = useCompareStore();
    const selected = isSelected(player.id);

    const isDisabled = !selected && selectedPlayers.length >= 3;

    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const { savedPlayerIds, toggleShortlist } = useShortlist();
    const isSaved = savedPlayerIds.includes(player.id);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const latestStats = player.stats?.[0];
    const diff = Date.now() - new Date(player.dateOfBirth).getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const marketValue = player.marketValue ? `€${(player.marketValue / 1000000).toFixed(1)}M` : "—";

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: C.cardBg,
                border: `1px solid ${selected ? C.primary : C.border}`,
                borderRadius: 16,
                padding: "20px 16px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: selected ? "0 0 15px rgba(0, 224, 148, 0.2)" : "none",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                height: 380,
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
                        600px circle at ${mousePos.x}px ${mousePos.y}px, 
                        rgba(0, 224, 148, 0.08), 
                        transparent 40%
                    )`,
                    pointerEvents: "none"
                }}
            />

            {selected && (
                <div style={{
                    position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
                    width: 100, height: 100, background: C.primary, filter: "blur(50px)", opacity: 0.15, zIndex: 0,
                    pointerEvents: "none"
                }} />
            )}
            <button
                onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    toggleShortlist(player.id);
                }}
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: isSaved ? C.primary : "rgba(0,0,0,0.4)",
                    border: `1px solid ${isSaved ? C.primary : C.border}`,
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    transition: "all 0.2s ease",
                    color: isSaved ? "#0F0F0F" : C.text,
                    backdropFilter: "blur(4px)"
                }}
                onMouseEnter={(e) => {
                    if (!isSaved) e.currentTarget.style.background = "rgba(0, 224, 148, 0.2)";
                }}
                onMouseLeave={(e) => {
                    if (!isSaved) e.currentTarget.style.background = "rgba(0,0,0,0.4)";
                }}
            >
                <Bookmark 
                    size={16} 
                    strokeWidth={2.5} 
                    fill={isSaved ? "#0F0F0F" : "none"} // Se rellena si está guardado
                />
            </button>

            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", zIndex: 1, marginBottom: 8 }}>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1 }}>
                        {age}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>
                        {player.position}
                    </span>
                    {player.flagUrl && (
                        <img src={player.flagUrl} alt="" style={{ width: 20, height: 14, objectFit: "cover", marginTop: 4, borderRadius: 2 }} referrerPolicy="no-referrer" />
                    )}
                </div>

                {/* Foto Central */}
            <Link to={`/players/${player.id}`} style={{ display: "block", textDecoration: "none" }}>
                    <div style={{
                        width: 120, height: 120, 
                        position: "relative", 
                        zIndex: 2,
                        display: "flex",
                        alignItems: "flex-end", 
                        justifyContent: "center"
                    }}>
                        {player.photoUrl ? (
                            <img 
                                src={player.photoUrl} 
                                alt={player.lastName} 
                                loading="lazy"
                                width="120"
                                height="120"
                                style={{ width: "100%", height: "100%", objectFit: "contain", dropShadow: "0px 10px 10px rgba(0,0,0,0.5)" }} 
                                referrerPolicy="no-referrer" 
                            />
                        ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: C.muted, borderRadius: "50%", background: "#0F0F0F" }}>
                                {player.firstName?.[0]}{player.lastName?.[0]}
                            </div>
                        )}
                    </div>
                </Link>

                {/* Columna Derecha: Equipo (Logo) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 30 }}>
                    {player.team?.logoUrl && (
                        <img src={player.team.logoUrl} alt="" style={{ width: 24, height: 24, objectFit: "contain", marginTop: 4 }} referrerPolicy="no-referrer" />
                    )}
                </div>
            </div>

            {/* ── NOMBRE ── */}
            <Link to={`/players/${player.id}`} style={{ textDecoration: "none", zIndex: 1, textAlign: "center", width: "100%" }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 12px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {player.firstName.charAt(0)}. {player.lastName}
                </h2>
            </Link>

            {/* Separador */}
            <div style={{ width: "80%", height: 1, background: C.border, marginBottom: 12, opacity: 0.5, zIndex: 1 }} />

            {/* ── STATS GRID ── */}
            <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px",
                width: "100%", padding: "0 12px", zIndex: 1, flex: 1
            }}>
                <StatRow label="PJ" value={latestStats?.matchesPlayed || 0} />
                <StatRow label="GOL" value={latestStats?.goals || 0} />
                <StatRow label="AST" value={latestStats?.assists || 0} />
                <StatRow label="PIE" value={player.preferredFoot?.substring(0, 3).toUpperCase() || "DER"} />
                <StatRow label="ALT" value={player.height ? `${player.height}m` : "—"} />
                <StatRow label="VAL" value={marketValue} />
            </div>

            {/* ── BOTÓN COMPARAR ── */}
            <button
                disabled={isDisabled}
                onClick={(e) => {
                    e.preventDefault();
                    selected ? removePlayer(player.id) : addPlayer(player);
                }}
                style={{
                    width: "100%", padding: "10px", marginTop: "auto",
                    background: selected ? "rgba(232, 64, 64, 0.1)" : "rgba(0, 224, 148, 0.1)",
                    color: selected ? "#E84040" : C.primary,
                    border: `1px solid ${selected ? "rgba(232, 64, 64, 0.2)" : "rgba(0, 224, 148, 0.2)"}`,
                    borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: isDisabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s", zIndex: 1, textTransform: "uppercase",
                    position: "relative" 
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = selected ? "rgba(232, 64, 64, 0.2)" : "rgba(0, 224, 148, 0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = selected ? "rgba(232, 64, 64, 0.1)" : "rgba(0, 224, 148, 0.1)"}
            >
                {selected ? "Quitar" : "Comparar"}
            </button>
        </div>
    );
}

function StatRow({ label, value }: { label: string, value: string | number }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            {/* El valor ocupa la mitad izquierda y se alinea a la derecha */}
            <span style={{ flex: 1, fontWeight: 800, color: "#F2F2F2", textAlign: "right" }}>
                {value}
            </span>

            {/* La etiqueta ocupa la mitad derecha y se alinea a la izquierda */}
            <span style={{ flex: 1, color: "#8C8C8C", fontWeight: 600, textAlign: "left" }}>
                {label}
            </span>
        </div>
    );
}