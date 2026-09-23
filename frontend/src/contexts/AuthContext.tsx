import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, org?: string) => Promise<void>;
  quickLogin: (type: 'demo' | 'admin') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('trustbreak_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('trustbreak_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const me = await api.get<User>('/auth/me');
          setUser(me);
          localStorage.setItem('trustbreak_user', JSON.stringify(me));
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.post<{ access_token: string; user: User }>('/auth/login', {
      email,
      password: pass
    });
    localStorage.setItem('trustbreak_token', res.access_token);
    localStorage.setItem('trustbreak_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, pass: string, org?: string) => {
    const res = await api.post<{ access_token: string; user: User }>('/auth/register', {
      name,
      email,
      password: pass,
      organization: org || 'Demo Corp'
    });
    localStorage.setItem('trustbreak_token', res.access_token);
    localStorage.setItem('trustbreak_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const quickLogin = async (type: 'demo' | 'admin') => {
    if (type === 'demo') {
      await login('demo@trustbreak.ai', 'Demo@123');
    } else {
      await login('admin@trustbreak.ai', 'Admin@123');
    }
  };

  const logout = () => {
    try {
      if (token) {
        api.post('/auth/logout').catch(() => {});
      }
    } finally {
      localStorage.removeItem('trustbreak_token');
      localStorage.removeItem('trustbreak_user');
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (token) {
      const me = await api.get<User>('/auth/me');
      setUser(me);
      localStorage.setItem('trustbreak_user', JSON.stringify(me));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, quickLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
