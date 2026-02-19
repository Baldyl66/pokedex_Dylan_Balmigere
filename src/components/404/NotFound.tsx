import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous cherchez n'existe pas.</p>
      <button onClick={() => navigate("/")} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Retour à l'accueil
      </button>
    </div>
  );
}
