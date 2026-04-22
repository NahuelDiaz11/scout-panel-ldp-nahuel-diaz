import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { PlayerCard } from "../components/players/PlayerCard";
import { Bookmark, LibraryBig } from "lucide-react";

export function ShortlistPage() {
    // Traemos la lista completa usando React Query
    const { data: savedItems = [], isLoading } = useQuery({
        queryKey: ["shortlist", "full"],
        queryFn: async () => {
            const res = await api.get("/shortlist");
            return res.data;
        }
    });

    return (
        <div style={{ paddingBottom: 80, fontFamily: "'Nunito Sans', sans-serif" }}>

            {/* ── ENCABEZADO ── */}
            <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(0, 224, 148, 0.1)", color: "#00E094",
                    padding: "6px 12px", borderRadius: 100, width: "fit-content",
                    fontSize: 12, fontWeight: 800, textTransform: "uppercase",
                    border: "1px solid rgba(0, 224, 148, 0.2)"
                }}>
                    <Bookmark size={14} strokeWidth={2.5} />
                    Mi Shortlist
                </div>

                <h1 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 900, color: "#F2F2F2", margin: 0 }}>
                    Jugadores Guardados
                </h1>

                <p style={{ fontSize: 15, color: "#8C8C8C", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                    <LibraryBig size={16} />
                    Tenés <span style={{ color: "#F2F2F2", fontWeight: 800 }}>{savedItems.length}</span> perfiles en seguimiento.
                </p>
            </div>

            {/* ── ESTADOS (Loading / Vacio / Grilla) ── */}
            {isLoading ? (
                <div style={{ color: "#8C8C8C", textAlign: "center", padding: 60 }}>
                    Cargando tu shortlist...
                </div>
            ) : savedItems.length === 0 ? (
                <div style={{
                    background: "#161616", border: "1px solid #242424", borderRadius: 16,
                    padding: 64, textAlign: "center", display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 16
                }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0, 224, 148, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00E094" }}>
                        <Bookmark size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 20, color: "#F2F2F2", margin: "0 0 8px 0", fontWeight: 800 }}>Tu lista está vacía</h3>
                        <p style={{ color: "#8C8C8C", margin: 0, fontSize: 14 }}>Guardá jugadores desde el panel principal usando el icono de la esquina en sus cartas.</p>
                    </div>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 16,
                }}>
                    {savedItems.map((item: any) => (
                        <PlayerCard key={item.id} player={item.player} />
                    ))}
                </div>
            )}
        </div>
    );
}