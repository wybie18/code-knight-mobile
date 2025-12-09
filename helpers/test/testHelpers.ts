import type { SubmitAttemptResponse, TestItem, TestResult } from "@/types/test";

/**
 * Format seconds into MM:SS string
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Get item type from itemable_type
 */
export const getItemType = (item: TestItem): "quiz" | "coding" | "essay" | "unknown" => {
  if (item.itemable_type.includes("QuizQuestion")) return "quiz";
  if (item.itemable_type.includes("CodingChallenge")) return "coding";
  if (item.itemable_type.includes("EssayQuestion")) return "essay";
  return "unknown";
};

/**
 * Transform API response to TestResult for UI display
 */
export const transformToTestResult = (data: SubmitAttemptResponse["data"]): TestResult => {
  const percentage = data.max_possible_score > 0 
    ? (data.total_score / data.max_possible_score) * 100 
    : 0;
  const passed = percentage >= 50;
  
  return {
    score: data.total_score,
    total_points: data.max_possible_score,
    percentage,
    passed,
    needs_manual_grading: data.needs_manual_grading,
    graded_items: data.graded_items,
    total_items: data.total_items,
  };
};

/**
 * Calculate remaining time for an attempt
 */
export const calculateRemainingTime = (
  startedAt: string, 
  durationMinutes: number
): number => {
  const startedAtTime = new Date(startedAt).getTime();
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startedAtTime) / 1000);
  return Math.max(0, durationMinutes * 60 - elapsedSeconds);
};

/**
 * Count words in a string
 */
export const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w).length;
};
