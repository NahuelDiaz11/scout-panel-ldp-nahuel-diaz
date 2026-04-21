import { Link, useLocation } from "react-router-dom";
import {
    Menu, Home, Search, Compass, ShieldCheck, DatabaseZap, BarChart3,
    Scale, RefreshCw, Users, Binoculars, Wrench, Settings,
    HelpCircle
} from "lucide-react";
import React from "react";

export function Sidebar() {
    const location = useLocation();

    // Mapa de navegación (Iconos -> Rutas)
    const navItems = [
        { icon: Home, path: "/" },
        { icon: Search, path: "/" },
        { icon: Compass, path: "/" },
        { icon: ShieldCheck, path: "/" },
        { icon: DatabaseZap, path: "/" },
        { icon: BarChart3, path: "/" },
        { icon: Scale, path: "/" },
        { icon: RefreshCw, path: "/" },
        { icon: Users, path: "/" },
        { icon: Binoculars, path: "/" },
        { icon: Wrench, path: "/" },
        { icon: Settings, path: "/" },
        { icon: HelpCircle, path: "/" },
    ];

    return (
        <aside style={{
            width: 68, 
            background: "var(--bg-surface)", 
            borderRight: "1px solid var(--border)", 
            height: "calc(100vh - 60px)", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 0",
            position: "sticky",
            top: 60, 
            zIndex: 100,
        }}>

            {/* Icono de menú (tres líneas) arriba de todo */}
            <button style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                marginBottom: 20
            }}>
                <Menu size={20} strokeWidth={1.5} />
            </button>

            <div style={{ width: "60%", height: 1, background: "var(--border)", marginBottom: 20 }} /> {/* Separador */}

            {/* ── 2. MENU DE NAVEGACION DE ICONOS ── */}
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, width: "100%", alignItems: "center" }}>
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <SidebarNavLink
                            key={index}
                            to={item.path}
                            icon={item.icon}
                            active={isActive}
                        />
                    );
                })}
            </nav>

            {/* Eliminamos el logout de acá, ya lo tenemos en el Navbar superior */}

        </aside>
    );
}

// ── COMPONENTE NAVLINK AUXILIAR
function SidebarNavLink({ to, icon: Icon, active }: {
    to: string;
    icon: React.ElementType;
    active: boolean;
}) {
    return (
        <Link to={to} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: "var(--radius-sm)",
            color: active ? "var(--primary)" : "var(--text-muted)", // var(--primary) : var(--text-muted)
            background: active ? "var(--primary-dim)" : "transparent", // var(--primary-dim) : transparent
            transition: "all 0.15s",
            textDecoration: "none"
        }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
            }}
        >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
        </Link>
    );
}