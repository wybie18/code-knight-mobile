import { ProgrammingLanguage } from "./settings";

export interface Test {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  instructions: string | null;
  course_id: number | null;
  teacher_id: number;
  duration_minutes: number | null;
  start_time: string | null;
  end_time: string | null;
  status: 'draft' | 'scheduled' | 'active' | 'closed' | 'archived';
  total_points: number;
  shuffle_questions: boolean;
  show_results_immediately: boolean;
  allow_review: boolean;
  max_attempts: number;
  created_at: string;
  updated_at: string;
  teacher?: User;
  course?: {
    id: number;
    title: string;
    slug: string;
    programming_language?: ProgrammingLanguage;
  };
  items_count?: number;
  students_count?: number;
  attempts_count?: number;
  items?: TestItem[];
  statistics?: TestStatistics;
  student_stats?: StudentTestStats;
  can_start_attempt?: boolean;
  attempts?: TestAttempt[];
}

export interface TestItem {
  id: number;
  test_id: number;
  itemable_type: string;
  itemable_id: number;
  order: number;
  points: number;
  created_at: string;
  updated_at: string;
  itemable?: QuizQuestion | CodingChallenge | EssayQuestion;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple_choice' | 'fill_blank' | 'boolean';
  options: string[];
  correct_answer?: string;
  explanation: string | null;
  points: number;
}

interface TestCase {
  input: string;
  expected_output: string;
}

interface LanguageConfig {
  id: number;
  language_id: number;
  name: string;
  starter_code: string;
}

export interface CodingChallenge {
  id: number;
  problem_statement: string;
  test_cases?: TestCase[];
  programming_languages: LanguageConfig[];
}

export interface EssayQuestion {
  id: number;
  question: string;
  points: number;
  word_limit: number | null;
}

export interface TestAttempt {
  id: number;
  test_id: number;
  student_id: number;
  attempt_number: number;
  started_at: string;
  submitted_at: string | null;
  time_spent_minutes: number | null;
  status: 'in_progress' | 'submitted' | 'graded' | 'abandoned';
  total_score: number | null;
  violations_count?: number;
  created_at: string;
  updated_at: string;
  student?: User;
  test?: Test;
  submissions?: TestItemSubmission[];
}

export interface TestItemSubmission {
  id: number;
  test_attempt_id: number;
  test_item_id: number;
  answer: string | any;
  answer_data: any | null;
  score: number | null;
  is_correct: boolean | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
  testItem?: TestItem;
  attempt?: TestAttempt;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface TestStatistics {
  total_students_assigned: number;
  students_attempted: number;
  students_not_attempted: number;
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  max_possible_score: number;
}

export interface StudentTestStats {
  total_attempts: number;
  attempts_remaining: number;
  best_score: number | null;
  max_possible_score: number;
  best_percentage: number;
  latest_attempt: TestAttempt | null;
}

// Violation types for anti-cheat
export type ViolationType = 
  | 'tab_switch'
  | 'app_background'
  | 'copy_paste'
  | 'screenshot'
  | 'screen_record';

export interface Violation {
  type: ViolationType;
  timestamp: string;
  details?: string;
}

export interface ViolationReport {
  attempt_id: number;
  violations: Violation[];
}

// API Response types
export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface TestApiResponse {
  success: boolean;
  data: Test[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}

export interface SingleTestApiResponse {
  success: boolean;
  data: Test;
  student_stats: StudentTestStats;
  can_start_attempt: boolean;
  message?: string;
}

export interface StartAttemptResponse {
  success: boolean;
  data: TestAttempt;
  message?: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  message?: string;
}

export interface SubmitAttemptResponse {
  success: boolean;
  data: {
    attempt: TestAttempt;
    total_score: number;
    max_possible_score: number;
    needs_manual_grading: boolean;
    graded_items: number;
    total_items: number;
  };
  message?: string;
}

// Transformed result for UI display
export interface TestResult {
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  needs_manual_grading: boolean;
  graded_items: number;
  total_items: number;
}

export interface AttemptDetailResponse {
  success: boolean;
  data: TestAttempt;
}
