import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import PokemonDetailedView from "../components/PokemonDetailed/PokemonDetailedView";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import RootLayout from "./RootLayout";

export default function MyRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique : Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes protégées avec RootLayout (contient AuthPanel) */}
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pokemon/:pokeId"
            element={
              <ProtectedRoute>
                <PokemonDetailedView />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rediriger les routes invalides vers l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
