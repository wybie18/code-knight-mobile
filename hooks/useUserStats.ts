import { useCallback, useState } from 'react';
import { clearStatsFromStorage, saveStatsToStorage } from '../helper/AsyncStorage';
import { getUserStats } from '../services/statsService';
import type { UserStats } from '../types/auth';

export function useUserStats() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const updateStats = useCallback((stats: UserStats | null) => {
    setUserStats(stats);
    saveStatsToStorage(stats);
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const stats = await getUserStats();
      setUserStats(stats);
      saveStatsToStorage(stats);
      return { success: true, stats };
    } catch (e) {
      console.error('Failed to refresh stats', e);
      return { success: false };
    }
  }, []);

  const clearStats = useCallback(() => {
    setUserStats(null);
    clearStatsFromStorage();
  }, []);

  return {
    userStats,
    updateStats,
    refreshStats,
    clearStats,
  };
}