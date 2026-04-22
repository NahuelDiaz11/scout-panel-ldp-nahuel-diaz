import React from 'react';
import type { Player } from '../../types';

const C = {
    surface: "#1C1C1C",
    border: "#242424",
    text: "#F2F2F2",
    muted: "#8C8C8C",
    primary: "#00E094",
};

// Sub-componente para cada jugador individual
function PlayerVSHeader({ player, align = "left", isMobile }: { player: any; align?: "left" | "right"; isMobile: boolean }) {
    const finalAlign = isMobile ? "left" : align; // Forzamos izquierda en mobile

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 16,
            flexDirection: finalAlign === "right" ? "row-reverse" : "row",
            textAlign: finalAlign === "right" ? "right" : "left",
            flexWrap: "wrap", justifyContent: "center"
        }}>
            <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: C.surface, overflow: "hidden",
                border: `2px solid ${C.border}`, flexShrink: 0,
            }}>
                {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: C.muted }}>
                        {player.firstName?.[0]}{player.lastName?.[0]}
                    </div>
                )}
            </div>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 10, justifyContent: finalAlign === "right" ? "flex-end" : "flex-start" }}>
                    {player.flagUrl && <img src={player.flagUrl} alt="" style={{ width: 22, height: 16, objectFit: "cover", borderRadius: 2 }} referrerPolicy="no-referrer" />}
                    <span>{player.firstName} {player.lastName}</span>
                </h2>
                <div style={{ fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 8, justifyContent: finalAlign === "right" ? "flex-end" : "flex-start" }}>
                    <span style={{ color: C.primary, fontWeight: 800 }}>{player.position}</span>
                    <span>|</span>
                    <span>{Math.floor((Date.now() - new Date(player.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years</span>
                </div>
            </div>
        </div>
    );
}

export function CompareHeader({ players, isMobile }: { players: Player[]; isMobile: boolean }) {
    const isThree = players.length === 3;

    const containerStyle: React.CSSProperties = isThree
        ? (isMobile
            ? { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }
            : { display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "center", gap: 20, width: "100%" })
        : { display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(16px, 4vw, 60px)", width: "100%", flexWrap: "wrap" };

    return (
        <div style={{ background: "#161616", borderBottom: "1px solid #242424", padding: "24px 40px", margin: "-24px -40px 32px -40px", display: "flex", justifyContent: "center" }}>
            <div style={{ ...containerStyle, maxWidth: 1000 }}>
                <PlayerVSHeader player={players[0]} align="right" isMobile={isMobile} />
                <div style={{ fontSize: 16, fontWeight: 900, color: "#8C8C8C", background: "#1C1C1C", padding: "8px 16px", borderRadius: 20 }}>VS</div>
                <PlayerVSHeader player={players[1]} align="left" isMobile={isMobile} />
                {players[2] && (
                    <>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "#8C8C8C", background: "#1C1C1C", padding: "8px 16px", borderRadius: 20 }}>VS</div>
                        <PlayerVSHeader player={players[2]} align="left" isMobile={isMobile} />
                    </>
                )}
            </div>
        </div>
    );
}