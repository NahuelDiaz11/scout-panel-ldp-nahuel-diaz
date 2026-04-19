import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { CompareBar } from "../players/CompareBar";

export function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "24px 32px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>
      <CompareBar />
    </div>
  );
}