import type { Difficulty } from "./settings";

export interface ChallengeProgress {
  total: number;
  completed: number;
}

export interface ChallengesProgressData {
  overall: ChallengeProgress;
  coding: ChallengeProgress;
  ctf: ChallengeProgress;
  typing: ChallengeProgress;
}

export interface ChallengesProgressResponse {
  success: boolean;
  data: ChallengesProgressData;
}

// Programming Language
export interface ProgrammingLanguage {
  id: number;
  name: string;
  version: string;
  language_id: number;
  created_at?: string;
  updated_at?: string;
  starter_code?: string;
}

// Test Case
export interface TestCase {
  input: string;
  expected_output: string;
}

// Coding Challenge
export interface CodingChallenge {
  id: number;
  problem_statement: string;
  test_cases?: TestCase[];
  programming_languages: ProgrammingLanguage[];
}

// CTF Category
export interface CtfCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// CTF Challenge
export interface CtfChallenge {
  id: number;
  category_id: number;
  category: CtfCategory;
  file_paths: string[];
  flag?: string;
}

// Challenge (supports both Coding and CTF)
export interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  points: number;
  hints: string | null;
  is_solved?: boolean;
  difficulty: Difficulty;
  created_at: string;
  updated_at: string;
  challengeable: CodingChallenge | CtfChallenge;
  type: string;
}

// Pagination Links
export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

// Pagination Meta
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

// API Response
export interface ChallengesResponse {
  success: boolean;
  data: Challenge[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

// Query Params
export interface ChallengesQueryParams {
  page?: number;
  search?: string;
  difficulty_ids?: number[];
  programming_language_ids?: number[];
  category_ids?: number[];
  hide_solved?: boolean;
}

// Programming Languages Response
export interface ProgrammingLanguagesResponse {
  success: boolean;
  data: ProgrammingLanguage[];
}

// CTF Categories Response
export interface CtfCategoriesResponse {
  success: boolean;
  data: CtfCategory[];
}

// Test Case Result
export interface TestCaseResult {
  test_case: number;
  passed: boolean;
  input: Record<string, any>;
  actual_output: string;
  expected_output: any;
  execution_time: string;
  memory_usage: number;
}

// Test Results
export interface TestResultsData {
  passed: boolean;
  total_cases: number;
  passed_cases: number;
  results: TestCaseResult[];
}

// Submission Results
export interface SubmissionResultsData {
  passed: boolean;
  total_cases: number;
  passed_cases: number;
  total_execution_time: string;
  total_memory_usage: number;
  avg_execution_time: string;
  avg_memory_usage: number;
  source_code: string;
}

// Challenge Submission (from database)
export interface ChallengeSubmission {
  id: number;
  user_id: number;
  challenge_id: number;
  submission_content: string;
  is_correct: boolean;
  results: {
    passed: boolean;
    total_cases: number;
    passed_cases: number;
    results: TestCaseResult[];
  };
  created_at: string;
  updated_at: string;
}

// Submissions List Response
export interface SubmissionsListResponse {
  success: boolean;
  data: {
    challenge: Challenge;
    submissions: ChallengeSubmission[];
    total_submissions: number;
    solved: boolean;
  };
}
