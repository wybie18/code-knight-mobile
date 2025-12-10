import type { CourseCategory, Difficulty, ProgrammingLanguage, SkillTag } from "../settings";
import { Creator } from "./course";
export interface StudentLesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  exp_reward: number;
  estimated_duration: number;
  order: number;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
}

export interface StudentActivity {
  id: string;
  title: string;
  description: string;
  type: "code" | "quiz";
  coding_activity_problem_id?: string;
  exp_reward: number;
  order: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
}

export interface StudentModule {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
  lessons: StudentLesson[];
  activities: StudentActivity[];
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  started_at: string;
  completed_at?: string;
  progress_percentage: number;
}

export interface StudentCourse {
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
  enrollment?: CourseEnrollment;
  progress?: UserCourseProgress;
  modules_count: number;
  enrolled_users_count: number;
  lessons_count: number;
  creator: Creator;
}

// Progress statistics
export interface CourseStatistics {
  total_content: number;
  total_lessons: number;
  total_activities: number;
  completed_content: number;
  progress_percentage: number;
  is_completed: boolean;
}

export interface CourseCompletionStats {
  started_at: string;
  completed_at: string;
  total_exp_earned: number;
  total_lessons_completed: number;
  total_activities_completed: number;
  completion_percentage: number;
}

export interface CurrentActiveContent {
  type: string;
  id: string;
  title: string;
  slug: string;
  order: number;
  module: {
    id: string;
    title: string;
    slug: string;
  }
}

export interface ModuleContentItem {
  type: "lesson" | "activity";
  id: string;
  title: string;
  description?: string;
  activity_type?: "code" | "quiz";
  slug?: string;
  order: number;
  exp_reward: number;
  estimated_duration?: number;
  is_required?: boolean;
  is_completed: boolean;
  url: string;
}

export interface ModuleWithContent {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  content: ModuleContentItem[];
}

export interface StudentCourseApiResponse {
  success: boolean;
  data: StudentCourse;
  statistics?: CourseStatistics;
  current_active_content?: CurrentActiveContent;
  content_by_modules?: ModuleWithContent[];
}

export interface StudentCourseCompletionApiResponse {
  success: boolean;
  message: string;
  data: StudentCourse;
  completion_stats: CourseCompletionStats;
}