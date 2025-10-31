import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, UserStats } from "../types/auth";

const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "user";
const USER_STATS_KEY = "userStats";

export const loadAuthFromStorage = async () => {
  const authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const userData = await AsyncStorage.getItem(USER_KEY);
  const statsData = await AsyncStorage.getItem(USER_STATS_KEY);

  if (authToken && userData) {
    try {
      return {
        token: authToken,
        user: JSON.parse(userData),
        stats: statsData ? JSON.parse(statsData) : null,
        storage: "local",
      };
    } catch (e) {
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY, USER_STATS_KEY]);
    }
  }

  return { token: null, user: null, stats: null, storage: null };
};

export const saveAuthToStorage = async (
  token: string,
  user: any,
  stats: any | null
) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    if (stats) await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
};

export const saveStatsToStorage = async (stats: UserStats | null) => {
  const authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (authToken) {
    if (stats) {
      await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
    } else {
      await AsyncStorage.removeItem(USER_STATS_KEY);
    }
    return;
  }
}

export const saveUserProfileToStorage = async (user: User) => {
  const authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (authToken) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthStorage = async () => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem(USER_STATS_KEY);
};

export const clearStatsFromStorage = async () => {
  await AsyncStorage.removeItem(USER_STATS_KEY);
};

export const clearUserProfileFromStorage = async () => {
  await AsyncStorage.removeItem(USER_KEY);
}