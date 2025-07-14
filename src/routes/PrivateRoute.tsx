import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const PrivateRoute = ({ children, requireAdmin = false }: Props) => {
  const { token } = useAuth();
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && role !== 'ADMIN') return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
