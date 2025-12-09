interface AchievementType {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  color: string;
  exp_reward: number;
  type: AchievementType | null;
  requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AchievementEarnedEvent {
  achievement: Achievement;
  message: string;
  earned_at: string;
}

export interface AchievementProgress {
  achievement: Achievement;
  earned: boolean;
  earned_at: string | null;
  progress: Record<string, { current: number; required: number; completed: boolean }>;
  progress_percentage: number;
}

export interface AchievementStats {
  total_achievements: number;
  earned_achievements: number;
  completion_percentage: number;
  type_stats: Array<{ name: string; count: number }>;
}

export interface NextToUnlock {
  achievement: Achievement;
  progress: Record<string, { current: number; required: number; completed: boolean }>;
  progress_percentage: number;
}