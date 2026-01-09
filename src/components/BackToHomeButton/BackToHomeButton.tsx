import { useNavigate } from "react-router-dom";

export default function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#f0f2ff",
        border: "1px solid #bdbdf0",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      🏠 Retour à l'accueil
    </button>
  );
}
