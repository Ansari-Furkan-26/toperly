// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  profileImage?: string;
  phone?: string;
  language?: string;
  bio?: string;
  expertise?: string[];
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
  phone?: string;
  language?: string;
  bio?: string;
  expertise?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'instructor') => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On mount, try to load user from localStorage
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) setUser(JSON.parse(userJson));
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'instructor'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (response.ok && resData.user) {
        setUser(resData.user);
        localStorage.setItem('user', JSON.stringify(resData.user));
        localStorage.setItem('token', resData.token);
        return true;
      } else {
        throw new Error(resData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Optionally, call backend logout endpoint if you implement session or refresh token invalidation
    fetch(`${API_BASE}/logout`, { method: 'POST' }).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
