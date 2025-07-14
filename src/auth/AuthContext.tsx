import { createContext, useState, useContext, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  userName: string | null;
  setToken: (token: string | null, userId?: string | null, userName?: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  const setToken = (newToken: string | null, newUserId: string | null = null, newUserName: string | null = null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      if (newUserId) localStorage.setItem('userId', newUserId);
      if (newUserName) localStorage.setItem('userName', newUserName);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    }
    setTokenState(newToken);
    setUserId(newUserId);
    setUserName(newUserName);
  };

  return (
    <AuthContext.Provider value={{ token, userId, userName, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
