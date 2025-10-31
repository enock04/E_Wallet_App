import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser).email);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, call API
    if (email && password) {
      const userData = { email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(email);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    // Mock signup - in real app, call API
    if (email && password) {
      const userData = { email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
