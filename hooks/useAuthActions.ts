import { Router } from "expo-router";
import { useCallback } from "react";
import api from "../api/AxiosConfig";
import {
  clearAuthStorage,
  saveAuthToStorage,
  saveUserProfileToStorage,
} from "../helper/AsyncStorage";
import { mapApiUserToUser } from "../helper/userMapper";
import {
  loginRequest,
  logoutRequest,
  refreshMe,
  registerRequest,
} from "../services/authService";
import type { ApiResponseUser } from "../types/auth";

interface UseAuthActionsProps {
  setAuthToken: (t: string | null) => void;
  setUser: (u: any | null) => void;
  setUserStats: (s: any | null) => void;
  navigation: Router;
}

export function useAuthActions({
  setAuthToken,
  setUser,
  setUserStats,
  navigation,
}: UseAuthActionsProps) {
  const login = useCallback(
    async (
      email: string,
      password: string,
      deviceName: string,
      remember: boolean
    ) => {
      try {
        const data = await loginRequest(email, password, deviceName);
        const { token, user, stats } = data;
        setAuthToken(token);
        const mapped = mapApiUserToUser(user as ApiResponseUser);
        setUser(mapped);
        setUserStats(stats ?? null);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        saveAuthToStorage(token, mapped, stats ?? null);
        return { success: true };
      } catch (e: any) {
        const message = e?.response?.data?.message ?? "Login failed";
        const errors = e?.response?.data?.errors ?? null;
        return { success: false, message, errors };
      }
    },
    [setAuthToken, setUser, setUserStats]
  );
  const register = useCallback(
    async (payload: any, deviceName: string, remember: boolean) => {
      try {
        const data = await registerRequest({
          ...payload,
          device_name: deviceName,
        });
        const { token, user, stats } = data;
        setAuthToken(token);
        const mapped = mapApiUserToUser(user as ApiResponseUser);
        setUser(mapped);
        setUserStats(stats ?? null);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        saveAuthToStorage(token, mapped, stats ?? null);
        return { success: true };
      } catch (e: any) {
        const message = e?.response?.data?.message ?? "Registration failed";
        const errors = e?.response?.data?.errors ?? null;
        return { success: false, message, errors };
      }
    },
    [setAuthToken, setUser, setUserStats]
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (e) {
      // ignore - still clear local state
      console.warn("Logout request failed", e);
    } finally {
      setAuthToken(null);
      setUser(null);
      setUserStats(null);
      clearAuthStorage();
      delete api.defaults.headers.common["Authorization"];
      navigation.push("/");
    }
  }, [setAuthToken, setUser, setUserStats, navigation]);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await refreshMe();
      const mapped = mapApiUserToUser(data.user as ApiResponseUser);
      setUser(mapped);
      setUserStats(data.stats ?? null);
      saveUserProfileToStorage(mapped);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }, [setUser, setUserStats]);

  return { login, register, logout, refreshProfile };
}
