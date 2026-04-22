import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Menu, Home, Bookmark, ArrowRightLeft
} from "lucide-react";

export function Sidebar() {
    const location = useLocation();

    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { icon: Home, path: "/", label: "Inicio" },
        { icon: ArrowRightLeft, path: "/compare", label: "Comparador" },
        { icon: Bookmark, path: "/shortlist", label: "Shortlist" },
    ];

    return (
        <aside style={{
            width: isExpanded ? 220 : 68,
            background: "var(--bg-surface)",
            borderRight: "1px solid var(--border)",
            height: "calc(100vh - 60px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: isExpanded ? "16px 12px" : "16px 0",
            position: "sticky",
            top: 60,
            zIndex: 100,
            transition: "all 0.3s ease",
            overflowX: "hidden"
        }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: 20,
                    alignSelf: isExpanded ? "flex-end" : "center",
                    transition: "all 0.3s ease"
                }}
            >
                <Menu size={20} strokeWidth={1.5} />
            </button>

            <div style={{ width: "60%", height: 1, background: "var(--border)", marginBottom: 20 }} />

            <nav style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "100%",
                alignItems: "center"
            }}>
                {navItems.map((item, index) => {
                    const isActive = item.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.path);

                    return (
                        <SidebarNavLink
                            key={index}
                            to={item.path}
                            icon={item.icon}
                            active={isActive}
                            isExpanded={isExpanded}
                            label={item.label}
                        />
                    );
                })}
            </nav>
        </aside>
    );
}

function SidebarNavLink({ to, icon: Icon, active, isExpanded, label }: {
    to: string;
    icon: React.ElementType;
    active: boolean;
    isExpanded: boolean;
    label: string;
}) {

    const activeColor = "#00E094";
    const mutedColor = "#8C8C8C";

    return (
        <Link to={to} style={{
            display: "flex",
            alignItems: "center",
            // Si está abierto alinea a la izquierda, si está cerrado al centro
            justifyContent: isExpanded ? "flex-start" : "center",
            width: isExpanded ? "100%" : 42,
            height: 42,
            padding: isExpanded ? "0 16px" : 0,
            borderRadius: "8px",
            color: active ? activeColor : mutedColor,
            background: active ? "rgba(0, 224, 148, 0.12)" : "transparent",
            transition: "all 0.2s ease",
            textDecoration: "none",
            boxSizing: "border-box",
            whiteSpace: "nowrap" // Evita que el texto pase a una segunda línea
        }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 20 }}>
                <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.5}
                    fill={active && Icon === Bookmark ? activeColor : "none"}
                />
            </div>

            <span style={{
                marginLeft: isExpanded ? 16 : 0,
                fontWeight: active ? 800 : 600,
                fontSize: 14,
                opacity: isExpanded ? 1 : 0,
                width: isExpanded ? "auto" : 0,
                overflow: "hidden",
                transition: "all 0.3s ease"
            }}>
                {label}
            </span>
        </Link>
    );
}