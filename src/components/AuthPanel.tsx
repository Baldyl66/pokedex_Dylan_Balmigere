import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logout } from '../store/slices/auth-slices';
import { useLogoutMutation } from '../store/slices/authApi';
import '../styles/AuthPanel.css';

export default function AuthPanel() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      //--- Nettoyer Redux même en cas d'erreur
      dispatch(logout());
      //--- Rediriger vers login
      navigate('/login');
    }
  };

  return (
    <div className="auth-panel">
      <div className="user-info">
        👤 {user?.username} <span className="role">({user?.role})</span>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Déconnexion
      </button>
    </div>
  );
}
