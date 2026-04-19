export function Badge({ children, color = "default" }: {
    children: React.ReactNode;
    color?: "default" | "green" | "blue" | "purple";
}) {
    const colors = {
        default: { bg: "var(--bg-hover)", text: "var(--text-muted)" },
        green: { bg: "var(--primary-dim)", text: "var(--primary)" },
        blue: { bg: "rgba(12,101,212,0.15)", text: "#4D9FFF" },
        purple: { bg: "rgba(117,51,252,0.15)", text: "#A67FFC" },
    };
    const c = colors[color];
    return (
        <span style={{
            background: c.bg,
            color: c.text,
            padding: "2px 8px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
        }}>
            {children}
        </span>
    );
}