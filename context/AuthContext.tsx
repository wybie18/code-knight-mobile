import { useRouter } from "expo-router";
import React, { createContext, useEffect, useMemo, useState } from "react";
import api from "../api/AxiosConfig";
import {
  loadAuthFromStorage,
  saveUserProfileToStorage,
} from "../helper/AsyncStorage";
import { useAuthActions } from "../hooks/useAuthActions";
import { useUserStats } from "../hooks/useUserStats";
import type { User, UserStats } from "../types/auth";

interface AuthContextType {
  authToken: string | null;
  user: User | null;
  userStats: UserStats | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (...args: any[]) => Promise<any>;
  register: (...args: any[]) => Promise<any>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<any>;
  updateUser: (apiUser: any) => void;
  refreshStats: () => Promise<any>;
  hasRole: (requiredRole: "student" | "admin") => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useRouter();

  const { userStats, updateStats, refreshStats } = useUserStats();

  const { login, register, logout, refreshProfile } = useAuthActions({
    setAuthToken,
    setUser,
    setUserStats: updateStats,
    navigation,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { token, user: storedUser, stats } = await loadAuthFromStorage();
        if (token && storedUser) {
          setAuthToken(token);
          setUser(storedUser);
          updateStats(stats ?? null);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateUser = (apiUser: any) => {
    const newUser: User = {
      id: apiUser.id,
      username: apiUser.username,
      first_name: apiUser.first_name,
      last_name: apiUser.last_name,
      student_id: apiUser.student_id,
      email: apiUser.email,
      role: apiUser.role,
      avatar: apiUser.avatar,
    };
    setUser(newUser as User);
    saveUserProfileToStorage(newUser);
  };

  const hasRole = (requiredRole: "student" | "admin"): boolean => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const value = useMemo(
    () => ({
      authToken,
      user,
      userStats,
      isAuthenticated: !!authToken && !!user,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      refreshStats,
      updateUser,
      hasRole,
    }),
    [
      authToken,
      user,
      userStats,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      refreshStats,
      hasRole,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
