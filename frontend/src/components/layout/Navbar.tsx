import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCompareStore } from "../../store/useCompareStore";
import { useAuthStore } from "../../store/useAuthStore";

const LDP_LOGO_URL = "https://framerusercontent.com/images/BPdPf6k8BgiSiBdZLnUfu46NeKY.png";

export function Navbar() {
  const { selectedPlayers } = useCompareStore();
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      
      {/* ── LOGO Y NOMBRE ── */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <img 
          src={LDP_LOGO_URL} 
          alt="LDP Logo" 
          style={{ height: 28, width: "auto" }} 
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* ── NAVEGACIÓN Y ACCIONES ── */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        
        {/* Links principales */}
        <div style={{ display: "flex", gap: 8 }}>
          <NavLink to="/" active={location.pathname === "/"}>
            Jugadores
          </NavLink>
          <NavLink to="/compare" active={location.pathname === "/compare"}>
            Comparador
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

        {/* Separador vertical */}
        <div style={{ width: 1, height: 24, background: "var(--border)" }} />

        {/* Botón Cerrar Sesión */}
        <button 
          onClick={handleLogout} 
          style={{ 
            background: "transparent", 
            border: "none", 
            color: "var(--text-muted)", 
            padding: "6px 12px", 
            borderRadius: "var(--radius-sm)", 
            fontSize: 14, 
            fontWeight: 600, 
            cursor: "pointer",
            transition: "all 0.15s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text)";
            e.currentTarget.style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Cerrar Sesión
        </button>

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
      textDecoration: "none"
    }}>
      {children}
    </Link>
  );
}