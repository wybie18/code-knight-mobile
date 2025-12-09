import { leaderboardService } from "@/services/leaderboardService";
import type { LeaderboardType, LeaderboardUser } from "@/types/leaderboard";
import { useCallback, useEffect, useState } from "react";

export const useLeaderboard = (type: LeaderboardType, limit: number = 50) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await leaderboardService.getLeaderboard(type, limit);
      setLeaderboard(response.data.leaderboard);

      try {
        const rankResponse = await leaderboardService.getMyRank(type);
        setMyRank(rankResponse.data.rank);
      } catch (rankError) {
        setMyRank(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load leaderboard"
      );
    } finally {
      setLoading(false);
    }
  }, [type, limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const refetch = async () => {
    await fetchLeaderboard();
  };

  return { leaderboard, myRank, loading, error, refetch };
};
