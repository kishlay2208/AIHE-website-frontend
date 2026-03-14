import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "@/services/api";
import type { User } from "@/types";

export type UserRole = "user" | "admin" | "superadmin";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  refreshUser: () => Promise<void>;
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
  const [role, setRole] = useState<UserRole>("user");
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
      // Backend returns UserResponse directly, not wrapped in ApiResponse
      const userData = (response as any).data || response;
      if (userData && userData.id) {
        setUser(userData);
        setIsLoggedIn(true);
        // Set role from user data
        if (userData.role) {
          setRole(userData.role as UserRole);
        }
      }
    } catch (error) {
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsLoggedIn(false);
      setRole("user");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      // apiClient.login() returns response.data, which is { access_token, token_type, user } from backend
      // So response is already the token data, not wrapped
      const tokenData = response as any;
      if (tokenData && tokenData.access_token) {
        localStorage.setItem("auth_token", tokenData.access_token);
        setUser(tokenData.user);
        setIsLoggedIn(true);
        setIsLoading(false); // Ensure loading is false after successful login
        if (tokenData.user?.role) {
          setRole(tokenData.user.role as UserRole);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.register({ name, email, password });
      // Backend returns { access_token, token_type, user } directly, not wrapped in ApiResponse
      const tokenData = (response as any).data || response;
      if (tokenData && tokenData.access_token) {
        localStorage.setItem("auth_token", tokenData.access_token);
        setUser(tokenData.user);
        setIsLoggedIn(true);
        setIsLoading(false); // Ensure loading is false after successful registration
        if (tokenData.user?.role) {
          setRole(tokenData.user.role as UserRole);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await apiClient.googleAuth(token);
      // Backend returns { access_token, token_type, user } directly, not wrapped in ApiResponse
      const tokenData = (response as any).data || response;
      if (tokenData && tokenData.access_token) {
        localStorage.setItem("auth_token", tokenData.access_token);
        setUser(tokenData.user);
        setIsLoggedIn(true);
        setIsLoading(false); // Ensure loading is false after successful Google login
        if (tokenData.user?.role) {
          setRole(tokenData.user.role as UserRole);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsLoggedIn(false);
    setRole("user");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) await loadUser();
  };

  // Update role when user changes (but allow manual override via setRole)
  useEffect(() => {
    if (user?.role) {
      setRole(user.role as UserRole);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, role, setRole, refreshUser, login, register, googleLogin, logout, isLoading }}
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
