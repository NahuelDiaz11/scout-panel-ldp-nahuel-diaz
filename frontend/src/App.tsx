import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { PlayersPage } from "./pages/PlayersPage";
import { ComparePage } from "./pages/ComparePage";
import { PlayerProfilePage } from "./pages/PlayerProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PlayersPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="players/:id" element={<PlayerProfilePage />} />
      </Route>
    </Routes>
  );
}