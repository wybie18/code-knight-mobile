export interface UserRank {
  rank: number;
  total_users: number;
  top_percentage: number;
}

export interface LeaderboardUser {
  rank: number;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  total_xp?: number;
  level?: number;
  challenges_solved?: number;
  total_points?: number;
  achievements_earned?: number;
  current_streak?: number;
  longest_streak?: number;
  courses_completed?: number;
}

export type LeaderboardType =
  | "levels"
  | "coding"
  | "ctf"
  | "typing"
  | "overall"
  | "achievements"
  | "streaks"
  | "courses";

export interface LeaderboardResponse {
  success: boolean;
  data: {
    type: LeaderboardType;
    leaderboard: LeaderboardUser[];
  };
}

export interface UserRankResponse {
  success: boolean;
  data: {
    type: LeaderboardType;
    rank: LeaderboardUser | null;
    message?: string;
  };
}