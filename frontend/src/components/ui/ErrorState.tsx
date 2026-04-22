import { AlertTriangle, WifiOff, RefreshCcw } from "lucide-react";

const C = { bg: "#0F0F0F", card: "#161616", text: "#F2F2F2", muted: "#8C8C8C", primary: "#00E094" };

interface ErrorStateProps {
    title?: string;
    message?: string;
    isOffline?: boolean;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Ocurrió un error inesperado",
    message = "No pudimos cargar la información. Por favor, intentá nuevamente.",
    isOffline = !navigator.onLine,
    onRetry
}: ErrorStateProps) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "60px 20px", textAlign: "center", background: C.card, borderRadius: 12,
            border: `1px dashed #242424`, margin: "24px 0"
        }}>
            <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "rgba(232, 64, 64, 0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
            }}>
                {isOffline ? <WifiOff size={32} color="#E84040" /> : <AlertTriangle size={32} color="#E84040" />}
            </div>

            <h3 style={{ color: C.text, fontSize: 18, fontWeight: 800, margin: "0 0 8px 0" }}>
                {isOffline ? "Sin conexión a internet" : title}
            </h3>

            <p style={{ color: C.muted, fontSize: 14, maxWidth: 400, margin: "0 0 24px 0", lineHeight: 1.5 }}>
                {isOffline ? "Parece que te quedaste sin señal. Revisá tu conexión y volvé a intentarlo." : message}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 24px",
                        background: "transparent", color: C.text, border: `1px solid #242424`,
                        borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#242424"; }}
                >
                    <RefreshCcw size={16} />
                    Reintentar
                </button>
            )}
        </div>
    );
}