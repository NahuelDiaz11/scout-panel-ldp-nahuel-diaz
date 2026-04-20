const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StatCircle({
    label, pct, color,
}: {
    label: string;
    pct: number;
    color: string;
}) {
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 72, height: 72 }}>
                <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
                    <circle
                        cx="36" cy="36" r={RADIUS}
                        fill="none" stroke="#2A2A2A" strokeWidth="4"
                    />
                    <circle
                        cx="36" cy="36" r={RADIUS}
                        fill="none" stroke={color} strokeWidth="4"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                    />
                </svg>
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "#F2F2F2",
                }}>
                    {pct}%
                </div>
            </div>
            <div style={{
                fontSize: 11, color: "#8C8C8C",
                textAlign: "center", lineHeight: 1.3,
            }}>
                {label}
            </div>
        </div>
    );
}