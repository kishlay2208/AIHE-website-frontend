import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "@/services/api";
import type { User } from "@/types";

export type UserRole = "user" | "admin" | "superadmin";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      if (response.success && response.data) {
        localStorage.setItem("auth_token", response.data.access_token);
        setUser(response.data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.register({ name, email, password });
      if (response.success && response.data) {
        localStorage.setItem("auth_token", response.data.access_token);
        setUser(response.data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await apiClient.googleAuth(token);
      if (response.success && response.data) {
        localStorage.setItem("auth_token", response.data.access_token);
        setUser(response.data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsLoggedIn(false);
  };

  const role: UserRole = user?.role ?? "user";

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, role, login, register, googleLogin, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
