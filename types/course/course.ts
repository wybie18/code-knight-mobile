import type { CourseCategory, Difficulty, ProgrammingLanguage, SkillTag } from "../settings";

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  objectives: string;
  requirements?: string;
  thumbnail: string | null;
  exp_reward: number;
  estimated_duration: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  difficulty: Difficulty;
  category: CourseCategory;
  skill_tags: SkillTag[];
  programming_language: ProgrammingLanguage;
  modules_count: number;
  enrolled_users_count: number;
  lessons_count: number;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Course[];
  meta: PaginationMeta;
}

export interface AllResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}
