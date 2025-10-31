import api from "../api/AxiosConfig";
import type {
    Challenge,
    ChallengeSubmission,
    ChallengesProgressData,
    ChallengesProgressResponse,
    ChallengesQueryParams,
    ChallengesResponse,
    ProgrammingLanguagesResponse,
} from "../types/challenges";
import type { DifficultiesResponse } from "../types/settings";

/**
 * Fetches the user's challenge progress across all challenge types
 * @returns Promise with overall, coding, ctf, and typing progress data
 */
export async function getChallengesProgress(): Promise<ChallengesProgressData> {
  const response = await api.get<ChallengesProgressResponse>(
    "/challenges/progress"
  );
  return response.data.data;
}

/**
 * Fetches coding challenges with optional filters
 * @param params - Query parameters for filtering
 * @returns Promise with challenges data and pagination
 */
export async function getCodingChallenges(
  params: ChallengesQueryParams = {}
): Promise<ChallengesResponse> {
  const queryParams = new URLSearchParams();

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params.search?.trim()) {
    queryParams.append("search", params.search.trim());
  }

  if (params.difficulty_ids && params.difficulty_ids.length > 0) {
    queryParams.append("difficulty_ids", params.difficulty_ids.join(","));
  }

  if (
    params.programming_language_ids &&
    params.programming_language_ids.length > 0
  ) {
    queryParams.append(
      "programming_language_ids",
      params.programming_language_ids.join(",")
    );
  }

  if (params.hide_solved) {
    queryParams.append("hide_solved", "true");
  }

  const url = `/challenges/coding${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const response = await api.get<ChallengesResponse>(url);
  return response.data;
}

/**
 * Fetches all difficulties
 * @returns Promise with difficulties data
 */
export async function getDifficulties(): Promise<DifficultiesResponse> {
  const response = await api.get<DifficultiesResponse>("/difficulties/all");
  return response.data;
}

/**
 * Fetches all programming languages
 * @returns Promise with programming languages data
 */
export async function getProgrammingLanguages(): Promise<ProgrammingLanguagesResponse> {
  const response =
    await api.get<ProgrammingLanguagesResponse>("/programming-languages/all");
  return response.data;
}

/**
 * Fetches a specific coding challenge by slug
 * @param slug - The unique slug of the challenge
 * @returns Promise with challenge data
 */
export async function getChallengeBySlug(
  slug: string
): Promise<{ success: boolean; data: Challenge }> {
  const response = await api.get<{ success: boolean; data: Challenge }>(
    `/challenges/coding/${slug}`
  );
  return response.data;
}

/**
 * Executes code for a challenge and returns test results
 * @param slug - The unique slug of the challenge
 * @param languageId - The programming language ID
 * @param userCode - The user's code to execute
 * @returns Promise with execution results
 */
export async function executeChallenge(
  slug: string,
  languageId: number,
  userCode: string
): Promise<{
  success: boolean;
  data: {
    passed: boolean;
    total_cases: number;
    passed_cases: number;
    results: Array<{
      test_case: number;
      passed: boolean;
      input: Record<string, any>;
      actual_output: string;
      expected_output: any;
      execution_time: string;
      memory_usage: number;
    }>;
  };
}> {
  const response = await api.post(`/challenges/coding/${slug}/execute-code`, {
    language_id: languageId,
    user_code: userCode,
  });
  return response.data;
}

/**
 * Submits code for a challenge
 * @param slug - The unique slug of the challenge
 * @param languageId - The programming language ID
 * @param userCode - The user's code to submit
 * @returns Promise with submission results
 */
export async function submitChallenge(
  slug: string,
  languageId: number,
  userCode: string
): Promise<{
  success: boolean;
  data: {
    passed: boolean;
    total_cases: number;
    passed_cases: number;
    total_execution_time: string;
    total_memory_usage: number;
    avg_execution_time: string;
    avg_memory_usage: number;
    source_code: string;
  };
}> {
  const response = await api.post(`/challenges/coding/${slug}/submit`, {
    language_id: languageId,
    user_code: userCode,
  });
  return response.data;
}

/**
 * Fetches all submissions for a specific challenge
 * @param slug - The unique slug of the challenge
 * @returns Promise with submissions list and challenge data
 */
export async function getChallengeSubmissions(
  slug: string
): Promise<{
  success: boolean;
  data: {
    challenge: Challenge;
    submissions: ChallengeSubmission[];
    total_submissions: number;
    solved: boolean;
  };
}> {
  const response = await api.get(`/challenges/coding/${slug}/submissions`);
  return response.data;
}

export const challengesService = {
  getChallengesProgress,
  getCodingChallenges,
  getDifficulties,
  getProgrammingLanguages,
  getChallengeBySlug,
  executeChallenge,
  submitChallenge,
  getChallengeSubmissions,
};
