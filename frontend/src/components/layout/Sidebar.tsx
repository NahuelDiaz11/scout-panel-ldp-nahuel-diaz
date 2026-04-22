import { Link, useLocation } from "react-router-dom";
import {
    Menu, Home, Bookmark
} from "lucide-react";
import React from "react";

export function Sidebar() {
    const location = useLocation();

    const navItems = [
        { icon: Home, path: "/" },
        { icon: Bookmark, path: "/shortlist" },
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

            <div style={{ width: "60%", height: 1, background: "var(--border)", marginBottom: 20 }} />

            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, width: "100%", alignItems: "center" }}>
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
                        />
                    );
                })}
            </nav>
        </aside>
    );
}

function SidebarNavLink({ to, icon: Icon, active }: {
    to: string;
    icon: React.ElementType;
    active: boolean;
}) {

    const activeColor = "#00E094";
    const mutedColor = "#8C8C8C";

    return (
        <Link to={to} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: "8px",
            color: active ? activeColor : mutedColor,
            background: active ? "rgba(0, 224, 148, 0.12)" : "transparent",
            transition: "all 0.15s",
            textDecoration: "none"
        }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
            }}
        >
            <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.5}
                fill={active && Icon === Bookmark ? activeColor : "none"}
            />
        </Link>
    );
}