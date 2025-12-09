import api from "@/api/AxiosConfig";
import type { ExecutionResult, ProgrammingLanguage } from "@/types/playground";

interface LanguagesResponse {
  success: boolean;
  data: ProgrammingLanguage[];
}

interface ExecuteCodeResponse {
  success: boolean;
  data: ExecutionResult;
}

export const playgroundService = {
  getLanguages: async (): Promise<LanguagesResponse> => {
    const response = await api.get("/programming-languages/all");
    return response.data;
  },

  executeCode: async (
    languageId: number,
    code: string,
    input: string | null = null
  ): Promise<ExecuteCodeResponse> => {
    const response = await api.post("/playground/execute-code", {
      language_id: languageId,
      user_code: code,
      user_input: input,
    });
    return response.data;
  },
};
