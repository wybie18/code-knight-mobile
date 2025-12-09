import api from "@/api/AxiosConfig";
import type {
    LeaderboardResponse,
    LeaderboardType,
    UserRankResponse,
} from "@/types/leaderboard";

export const leaderboardService = {
  getLeaderboard: async (
    type: LeaderboardType,
    limit: number = 50
  ): Promise<LeaderboardResponse> => {
    const response = await api.get(`/leaderboards/${type}`, {
      params: { limit },
    });
    return response.data;
  },

  getMyRank: async (type: LeaderboardType): Promise<UserRankResponse> => {
    const response = await api.get(`/leaderboards/my-rank`, {
      params: { type },
    });
    return response.data;
  },
};
