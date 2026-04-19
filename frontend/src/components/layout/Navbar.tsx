import { Link, useLocation } from "react-router-dom";
import { useCompareStore } from "../../store/useCompareStore";

export function Navbar() {
  const { selectedPlayers } = useCompareStore();
  const location = useLocation();

  return (
    <nav style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 32px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "var(--radius-sm)",
          background: "var(--primary)", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 14, color: "#0F0F0F",
        }}>SP</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
          Scout Panel
        </span>
      </Link>

      <div style={{ display: "flex", gap: 8 }}>
        <NavLink to="/" active={location.pathname === "/"}>
          Players
        </NavLink>
        <NavLink to="/compare" active={location.pathname === "/compare"}>
          Compare
          {selectedPlayers.length > 0 && (
            <span style={{
              marginLeft: 6,
              background: "var(--primary)",
              color: "#0F0F0F",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              padding: "1px 7px",
            }}>
              {selectedPlayers.length}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} style={{
      padding: "6px 14px",
      borderRadius: "var(--radius-sm)",
      fontSize: 14,
      fontWeight: 600,
      color: active ? "var(--primary)" : "var(--text-muted)",
      background: active ? "var(--primary-dim)" : "transparent",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
    }}>
      {children}
    </Link>
  );
}