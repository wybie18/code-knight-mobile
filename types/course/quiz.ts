import type { NextContent, PrevContent } from "../navigation/navigation";

export interface StudentQuizSubmission {
  id: string;
  answer: QuizAnswer;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizAnswer {
  answers: Record<string, string>;
  correct_count: number;
  total_questions: number;
  score_percentage: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "fill_blank" | "multiple_choice" | "boolean";
  points: number;
  order: number;
  options?: string[] | null;
  correct_answer?: string;
  explanation?: string;
}

export interface StudentQuizActivity {
  id: string;
  title: string;
  description: string;
  type: string;
  exp_reward: number;
  order: number;
  is_required: boolean;
  questions: QuizQuestion[];
  submissions: StudentQuizSubmission[];
  created_at: string;
  updated_at: string;
}

export interface QuizActivityApiResponse {
  success: boolean;
  data: StudentQuizActivity;
  prev_content?: PrevContent;
  next_content?: NextContent;
}
