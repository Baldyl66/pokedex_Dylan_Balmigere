import { Outlet, useLocation } from "react-router-dom";
import AuthPanel from "../components/AuthPanel";
import { useAppSelector } from "../hooks/useAppSelector";

export default function RootLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  //--- Ne pas afficher AuthPanel sur la page de détail d'un Pokémon
  
  const isPokemonDetailPage = location.pathname.startsWith('/pokemon/');

  return (
    <>
      <Outlet />
      {/* Affiche le panneau auth seulement si l'utilisateur est connecté et pas sur une page Pokémon */}
      {isAuthenticated && !isPokemonDetailPage && <AuthPanel />}
    </>
  );
}
