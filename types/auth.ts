export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  student_id?: string | null;
  email: string;
  role: string;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Level {
  level_number: number;
  name: string;
  icon: string;
  description: string;
  xp_required?: number;
}

export interface UserLevel {
  current_level: number;
  total_xp: number;
  xp_for_current_level: number;
  xp_for_next_level: number;
  xp_needed_for_next_level: number;
  xp_progress_in_current_level: number;
  progress_percentage: number;
  current_milestone: Level | null;
  next_milestone: Level | null;
}

export interface UserStats {
  level: UserLevel;
  courses_enrolled: number;
  courses_completed: number;
  activities_completed: number;
  achievements_earned: number;
  badges_earned: number;
  current_streak: number;
  longest_streak: number;
  total_submissions: number;
  challenge_submissions: number;
  challenges_completed: number;
}

export interface AuthPayload {
  token: string;
  user: User;
  stats: UserStats | null;
}

export interface ApiResponseUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  student_id: string | null;
  email: string;
  role: string;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
}
