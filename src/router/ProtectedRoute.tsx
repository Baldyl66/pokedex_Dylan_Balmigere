import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';

interface ProtectedRouteProps {
  children: ReactNode;
}

//--- Composant qui protège une route en vérifiant si l'utilisateur est authentifié

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    //--- Rediriger vers le login si pas authentifié
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
