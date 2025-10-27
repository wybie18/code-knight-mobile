export interface Difficulty {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface SkillTag {
  id: number;
  name: string;
  color: string;
}

export interface ProgrammingLanguage {
  id: number;
  name: string;
  version: string;
  language_id: string;
  created_at: string;
  updated_at: string;
}