import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Secrets différents pour chaque type de token
const ACCESS_TOKEN_SECRET = "access_secret_12345";
const REFRESH_TOKEN_SECRET = "refresh_secret_67890";

// --- Middleware ---
app.use(express.json());
app.use(cookieParser()); // Indispensable pour lire les cookies
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"], // Support tous les ports Vite courants
    credentials: true, // Autorise l'envoi des cookies (Refresh Token)
  }),
);

// --- Données de test ---
const USER = {
  id: "user_01",
  username: "Sacha",
  password: "passwordPokedex123",
  role: "student",
};

// --- Helpers de génération ---
const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }, // Durée courte
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }, // Durée longue
  );
};

// --- Routes ---

// 1. LOGIN : Envoie l'Access en JSON et le Refresh en Cookie
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log(`[LOGIN] Tentative: ${username}`);

  if (username === USER.username && password === USER.password) {
    const accessToken = generateAccessToken(USER);
    const refreshToken = generateRefreshToken(USER);

    // Stockage du Refresh Token dans un cookie HTTP-only (sécurisé)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Non accessible via document.cookie en JS
      secure: false, // Mettre à true en production avec HTTPS
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    console.log(`[LOGIN] ✅ Succès pour ${username}`);
    
    return res.json({
      accessToken,
      refreshToken,
      user: { username: USER.username, role: USER.role },
    });
  }

  console.log(`[LOGIN] ❌ Echec pour ${username} - identifiants invalides`);
  res.status(401).json({ message: "Identifiants invalides" });
});

// 2. REFRESH : Génère un nouvel Access Token à partir du Refresh Token
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Session expirée (pas de refresh token)" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Refresh token invalide ou expiré" });

    // On recrée un access token tout neuf
    const newAccessToken = generateAccessToken(USER);
    res.json({ accessToken: newAccessToken });
  });
});

// 3. LOGOUT : Supprime le cookie de refresh
app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  console.log("[LOGOUT] ✅ Session fermée");
  res.json({ message: "Déconnecté" });
});

// --- Middleware de protection des routes ---
function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Accès refusé" });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token expiré ou invalide" });
    req.user = user;
    next();
  });
}

// 4. ROUTE PROTÉGÉE
app.get("/profile", authenticateJWT, (req, res) => {
  res.json({ message: "Données privées récupérées", user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
  console.log(`📝 Identifiants de test: Sacha / passwordPokedex123`);
});
