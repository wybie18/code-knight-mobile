import api from "../api/AxiosConfig";

interface ApiResponseUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  student_id: string | null;
  email: string;
  role: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  username: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: any | null;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const profileService = {
  async updateProfile(formData: FormData) {
    const response = await api.post<{ success: boolean; data: ApiResponseUser }>(
      "/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  async changePassword(data: PasswordChangeData) {
    const response = await api.put("/password", data);
    return response.data;
  },

  async deleteAccount(password: string) {
    const response = await api.delete("/profile/delete", {
      data: { password },
    });
    return response.data;
  },
};
