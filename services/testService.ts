import api from "@/api/AxiosConfig";
import type {
    AttemptDetailResponse,
    SingleTestApiResponse,
    StartAttemptResponse,
    SubmitAnswerResponse,
    SubmitAttemptResponse,
    TestApiResponse
} from "@/types/test";

export const testService = {
  // Get all tests assigned to the student
  getMyTests: async (): Promise<TestApiResponse> => {
    const response = await api.get("/my-tests");
    return response.data;
  },

  // Get single test details with student stats
  getTestDetail: async (testSlug: string): Promise<SingleTestApiResponse> => {
    const response = await api.get(`/my-tests/${testSlug}`);
    return response.data;
  },

  // Start a new attempt
  startAttempt: async (testSlug: string): Promise<StartAttemptResponse> => {
    const response = await api.post(`/my-tests/${testSlug}/start`);
    return response.data;
  },

  // Get student's attempts for a test
  getMyAttempts: async (testSlug: string): Promise<any> => {
    const response = await api.get(`/my-tests/${testSlug}/attempts`);
    return response.data;
  },

  // Get attempt details (for review)
  getAttemptDetail: async (testSlug: string, attemptId: number): Promise<AttemptDetailResponse> => {
    const response = await api.get(`/my-tests/${testSlug}/attempts/${attemptId}`);
    return response.data;
  },

  // Submit answer for a single item (auto-save)
  submitAnswer: async (
    testSlug: string,
    attemptId: number,
    testItemId: number,
    answer: string | any
  ): Promise<SubmitAnswerResponse> => {
    const response = await api.post(
      `/my-tests/${testSlug}/attempts/${attemptId}/items/${testItemId}/submit`,
      { answer }
    );
    return response.data;
  },

  // Submit the entire attempt
  submitAttempt: async (testSlug: string, attemptId: number): Promise<SubmitAttemptResponse> => {
    const response = await api.post(`/my-tests/${testSlug}/attempts/${attemptId}/submit`);
    return response.data;
  },

  // Execute code for coding challenge
  executeCode: async (
    testSlug: string,
    attemptId: number,
    testItemId: number,
    languageId: number,
    code: string
  ): Promise<any> => {
    const response = await api.post(
      `/my-tests/${testSlug}/attempts/${attemptId}/items/${testItemId}/execute`,
      { language_id: languageId, code }
    );
    return response.data;
  },
};
