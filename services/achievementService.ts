import api from "@/api/AxiosConfig";
import type {
    AchievementProgress,
    AchievementStats,
    NextToUnlock,
} from "@/types/achievement";

interface AchievementProgressResponse {
  success: boolean;
  data: {
    achievements: AchievementProgress[];
    stats: AchievementStats;
  };
}

interface NextToUnlockResponse {
  success: boolean;
  data: NextToUnlock | null;
}

export const achievementService = {
  getMyProgress: async (): Promise<AchievementProgressResponse> => {
    const response = await api.get("/achievements/my-progress");
    return response.data;
  },

  getNextToUnlock: async (): Promise<NextToUnlockResponse> => {
    const response = await api.get("/achievements/next-to-unlock");
    return response.data;
  },
};
