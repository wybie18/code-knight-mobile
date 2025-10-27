import api from "../api/AxiosConfig";
import type { ApiResponseUser, AuthPayload } from "../types/auth";

export async function loginRequest(
  email: string,
  password: string,
  deviceName: string
) {
  const res = await api.post<{ success: boolean; data: AuthPayload }>(
    "/login",
    {
      email,
      password,
      device_name: deviceName,
    }
  );
  return res.data.data;
}

export async function registerRequest(payload: any) {
  const res = await api.post<{ success: boolean; data: AuthPayload }>(
    "/register",
    payload
  );
  return res.data.data;
}

export async function logoutRequest() {
  return api.post("/logout");
}

export async function refreshMe() {
  const res = await api.get<{
    success: boolean;
    data: { user: ApiResponseUser; stats?: any };
  }>("/me");
  return res.data.data;
}
