import api from "../api/AxiosConfig";
import type { AllResponse, ApiResponse } from "../types/course/course";
import type { StudentCourseApiResponse, StudentCourseCompletionApiResponse } from "../types/course/student-course";
import type { CourseCategory, Difficulty } from "../types/settings";
import type { Test } from "../types/test";

export const courseService = {
  getCourses: async (params: {
    page: number;
    search?: string;
    category_ids?: number[];
    difficulty_ids?: number[];
  }) => {
    const urlParams = new URLSearchParams({
      page: params.page.toString(),
      is_published: "1",
    });

    if (params.search?.trim()) {
      urlParams.append("search", params.search.trim());
    }

    params.category_ids?.forEach((id) => {
      urlParams.append("category_id", id.toString());
    });

    params.difficulty_ids?.forEach((id) => {
      urlParams.append("difficulty_id", id.toString());
    });

    const response = await api.get<ApiResponse>(`/courses?${urlParams}`);
    return response.data;
  },

  getCourseBySlug: async (slug: string) => {
    const response = await api.get<StudentCourseApiResponse>(`/courses/${slug}`);
    return response.data;
  },

  getCourseCompletion: async (slug: string) => {
    const response = await api.get<StudentCourseCompletionApiResponse>(`/courses/${slug}/completion`);
    return response.data;
  },

  getDifficulties: async () => {
    const response = await api.get<AllResponse<Difficulty>>("/difficulties/all");
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<AllResponse<CourseCategory>>("/course-categories/all");
    return response.data;
  },

  getCourseTests: async (slug: string, openOnly: boolean = true) => {
    const response = await api.get<{ success: boolean; data: Test[] }>(`/courses/${slug}/tests`, {
      params: { open_only: openOnly ? 1 : 0 },
    });
    return response.data;
  },
};
