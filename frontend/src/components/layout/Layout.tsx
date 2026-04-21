import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { CompareBar } from "../players/CompareBar";

export function Layout() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0F0F0F",
      fontFamily: "'Nunito Sans', sans-serif"
    }}>

      <Navbar />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        minWidth: 0,
        height: "calc(100vh - 60px)",
      }}>

        <Sidebar />

        {/* ── AREA PRINCIPAL CON EL DEGRADÉ VERDE ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          background: "radial-gradient(circle at 90% 80%, rgba(0, 224, 148, 0.15) 0%, #0F0F0F 55%)"
        }}>

          <main style={{
            flex: 1,
            padding: "24px 32px",
            width: "100%",
            maxWidth: 1600,
            margin: "0 auto",
            overflowY: "auto"
          }}>
            <Outlet />
          </main>

          <CompareBar />
        </div>

      </div>

    </div>
  );
}