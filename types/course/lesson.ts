import type { NextContent, PrevContent } from "../navigation/navigation";
import type { StudentCourse } from "./student-course";

export interface NavigationContext {
  current_index: number;
  total_content: number;
  has_previous: boolean;
  has_next: boolean;
  previous?: PrevContent;
  next?: NextContent;
}

export interface StudentLesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  exp_reward: number;
  estimated_duration: number;
  order: number;
  course: StudentCourse;
  created_at: string;
  updated_at: string;
}

export interface StudentLessonApiResponse {
  success: boolean;
  data: StudentLesson;
  prev_content?: PrevContent;
  next_content?: NextContent;
}

export interface TestCase {
  id: string;
  input: string;
  expected_output: string;
}

export interface CodingProblem {
  id: string;
  problem_statement: string;
  starter_code: string;
  test_cases?: TestCase[];
}

export interface StudentExercise {
  id: string;
  title: string;
  description: string;
  type: string;
  exp_reward: number;
  order: number;
  is_required: boolean;
  problem: CodingProblem;
  course: StudentCourse;
  created_at: string;
  updated_at: string;
}

export interface StudentExerciseApiResponse {
  success: boolean;
  data: StudentExercise;
  prev_content?: PrevContent;
  next_content?: NextContent;
}

export interface TestCaseResult {
  test_case: number;
  passed: boolean;
  input?: Record<string, any>;
  actual_output?: string;
  expected_output?: any;
  execution_time?: string;
  memory_usage?: number;
  error?: string;
  stderr?: string | null;
  stdout?: string;
}

export interface TestResultsData {
  passed: boolean;
  total_cases: number;
  passed_cases: number;
  results: TestCaseResult[];
}
