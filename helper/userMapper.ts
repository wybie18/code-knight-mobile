import type { User, ApiResponseUser } from "../types/auth";

export function mapApiUserToUser(apiUser: ApiResponseUser): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    student_id: apiUser.student_id ?? null,
    email: apiUser.email,
    role: apiUser.role ?? "student",
    avatar: apiUser.avatar ?? null,
  };
}
