import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import PokemonDetailedView from "../components/pokedex/PokemonDetailedView";

export default function MyRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pokemon/:pokeId" element={<PokemonDetailedView />} />
        {/* Rediriger les routes invalides vers l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
