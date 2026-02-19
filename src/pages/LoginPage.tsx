import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setAuth, setError } from '../store/slices/auth-slices';
import { useLoginMutation } from '../store/slices/authApi';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await login({ username, password }).unwrap();
      
      //--- Stocker le token et les infos utilisateur dans Redux
      
      dispatch(setAuth({
        accessToken: response.accessToken,
        user: response.user
      }));

      //--- Rediriger vers la page d'accueil

      navigate('/');
    } catch (error: any) {
      console.error('Erreur de login:', error);
      
      //--- Gérer les différents types d'erreurs RTK Query

      let errorMessage = 'Erreur de connexion';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 'FETCH_ERROR') {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est lancé sur http://localhost:3000';
      } else if (error?.status === 401) {
        errorMessage = 'Identifiants invalides';
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Pokédex - Login</h1>
        <p className="login-subtitle">Connectez-vous pour accéder au Pokédex</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: Sacha"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              disabled={isLoading}
            />
          </div>

          {localError && <div className="error-message">{localError}</div>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Identifiants de test :</strong></p>
          <p>Username: <code>Sacha</code></p>
          <p>Password: <code>passwordPokedex123</code></p>
        </div>
      </div>
    </div>
  );
}
