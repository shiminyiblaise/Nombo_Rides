import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bikeModel?: string;
  plateNumber?: string;
  earnings?: number;
  status?: string;
  rating?: number;
  totalRides?: number;
  savedLocations?: any[];
}

interface AuthContextType {
  user: User | null;
  userType: string | null;
  loading: boolean;
  login: (email: string, password: string, loginType: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  registerRider: (data: any) => Promise<string>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  loading: true,
  login: async () => {},
  registerUser: async () => {},
  registerRider: async () => '',
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('nombo_token');
      if (!token) {
        setUser(null);
        setUserType(null);
        setLoading(false);
        return;
      }
      const data = await api.verify();
      setUser(data.user);
      setUserType(data.type);
    } catch {
      localStorage.removeItem('nombo_token');
      setUser(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, loginType: string) => {
    const data = await api.login({ email, password, loginType });
    localStorage.setItem('nombo_token', data.token);
    setUser(data.user);
    setUserType(loginType);
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const data = await api.registerUser({ name, email, password });
    localStorage.setItem('nombo_token', data.token);
    setUser(data.user);
    setUserType('user');
  };

  const registerRider = async (data: any) => {
    const result = await api.registerRider(data);
    return result.message;
  };

  const logout = () => {
    localStorage.removeItem('nombo_token');
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, login, registerUser, registerRider, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
