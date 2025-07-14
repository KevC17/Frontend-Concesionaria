import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

const PublicOnlyRoute = ({ children }: Props) => {
  const { token } = useAuth();

  return token ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
