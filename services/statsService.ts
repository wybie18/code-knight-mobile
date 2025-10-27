import api from "../api/AxiosConfig";
import type { UserStats } from "../types/auth";

export async function getUserStats() {
  const res = await api.get<UserStats>("/stats");
  return res.data;
}
