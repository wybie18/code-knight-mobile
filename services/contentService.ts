import api from "@/api/AxiosConfig";
import type {
  StudentExerciseApiResponse,
  StudentLessonApiResponse,
  TestResultsData,
} from "@/types/course/lesson";
import type { QuizActivityApiResponse } from "@/types/course/quiz";
import { NextContent } from "@/types/navigation/navigation";

// Lesson API
export const getLessonBySlug = async (
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<StudentLessonApiResponse> => {
  const response = await api.get<StudentLessonApiResponse>(
    `/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`
  );
  return response.data;
};

export const markLessonComplete = async (
  lessonSlug: string
): Promise<any> => {
  const response = await api.post(`/lessons/${lessonSlug}/complete`);
  return response.data;
};

// Exercise API
export const getExerciseById = async (
  courseSlug: string,
  moduleSlug: string,
  exerciseId: string
): Promise<StudentExerciseApiResponse> => {
  const response = await api.get<StudentExerciseApiResponse>(
    `/courses/${courseSlug}/modules/${moduleSlug}/activities/${exerciseId}`
  );
  return response.data;
};

export const submitCode = async (
  activityId: string,
  languageId: number,
  userCode: string
): Promise<{ success: boolean; data: TestResultsData, next_content: NextContent | null }> => {
  const response = await api.post<{ success: boolean; data: TestResultsData, next_content: NextContent | null }>(
    `/activities/${activityId}/submit-code`,
    {
      language_id: languageId,
      user_code: userCode,
    }
  );
  return response.data;
};

export const executeCode = async (
  languageId: number,
  userCode: string,
  userInput: string | null = null
): Promise<{
  success: boolean;
  data: {
    output: string;
    error: string | null;
    execution_time: string;
    memory_usage: number;
  };
}> => {
  const response = await api.post(
    `/playground/execute-code`,
    {
      language_id: languageId,
      user_code: userCode,
      user_input: userInput,
    }
  );
  return response.data;
};

// Quiz API
export const getQuizById = async (
  courseSlug: string,
  moduleSlug: string,
  quizId: string
): Promise<QuizActivityApiResponse> => {
  const response = await api.get<QuizActivityApiResponse>(
    `/courses/${courseSlug}/modules/${moduleSlug}/activities/${quizId}`
  );
  return response.data;
};

export const submitQuiz = async (
  activityId: string,
  answers: Record<string, string>
): Promise<{ success: boolean }> => {
  const response = await api.post(`/activities/${activityId}/submit-quiz`, {
    answers,
  });
  return response.data;
};
