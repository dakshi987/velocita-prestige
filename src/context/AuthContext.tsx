import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => Promise<User>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const stored = getStoredToken();
      if (!stored) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getCurrentUser();
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired or invalid, logging out', err);
        removeStoredToken();
        setUser(null);
        setTokenState(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.login({ email, password });
    setStoredToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }): Promise<User> => {
    const res = await api.register(data);
    setStoredToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    removeStoredToken();
    setTokenState(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'fleet_manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
