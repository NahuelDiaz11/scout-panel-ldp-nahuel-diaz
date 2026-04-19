import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { PlayersPage } from "./pages/PlayersPage";
import { ComparePage } from "./pages/ComparePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PlayersPage />} />
        <Route path="compare" element={<ComparePage />} />
      </Route>
    </Routes>
  );
}