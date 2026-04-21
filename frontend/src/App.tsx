import { Routes, Route } from "react-router-dom";
import { PlayersPage } from "./pages/PlayersPage";
import { ComparePage } from "./pages/ComparePage";
import { PlayerProfilePage } from "./pages/PlayerProfilePage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./components/layout/Layout";
import { RegisterPage } from "./pages/RegisterPage";


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<PlayersPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="players/:id" element={<PlayerProfilePage />} />
        </Route>

      </Route>
    </Routes>
  );
}