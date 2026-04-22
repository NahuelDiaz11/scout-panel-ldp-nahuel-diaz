import type { Player } from '../../types';

export function CompareSummary({ players, colors }: { players: Player[]; colors: string[] }) {

    const rows = [
        { label: "Altura", getValue: (p: any) => p.height ?? "—" },
        { label: "Pie Hábil", getValue: (p: any) => p.preferredFoot ?? "—" },
        { label: "Partidos", getValue: (p: any) => p.stats?.reduce((acc: number, s: any) => acc + s.matchesPlayed, 0) || 0 },
        { label: "Goles", getValue: (p: any) => p.stats?.reduce((acc: number, s: any) => acc + s.goals, 0) || 0 },
        { label: "Valor", getValue: (p: any) => p.marketValue ? `€ ${(p.marketValue / 1000000).toFixed(1)}M` : "—" }
    ];

    return (
        <div style={{ background: "#161616", border: "1px solid #242424", borderRadius: 12, padding: 24, marginBottom: 32 }}>
            <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 700, color: "#F2F2F2", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 3, height: 14, background: "#00E094", borderRadius: 2, display: "inline-block" }} />
                Perfil General
            </div>
            <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 500 }}>
                    <div style={{ display: "grid", gridTemplateColumns: `2fr repeat(${players.length}, 1fr)`, gap: 16, paddingBottom: 12, borderBottom: "1px solid #242424", fontSize: 12, color: "#8C8C8C", fontWeight: 700 }}>
                        <div>Característica</div>
                        {players.map((p, i) => <div key={p.id} style={{ textAlign: "center", color: colors[i] }}>{p.lastName}</div>)}
                    </div>
                    {rows.map((row, index) => (
                        <div key={row.label} style={{ display: "grid", gridTemplateColumns: `2fr repeat(${players.length}, 1fr)`, gap: 16, padding: "14px 0", borderBottom: index !== rows.length - 1 ? "1px solid #242424" : "none", fontSize: 14, color: "#F2F2F2" }}>
                            <div style={{ fontWeight: 600 }}>{row.label}</div>
                            {players.map((p) => <div key={p.id} style={{ textAlign: "center", fontWeight: 700 }}>{row.getValue(p)}</div>)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}