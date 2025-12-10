import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { challengesService } from "../services/challengesService";
import type { ChallengesProgressData } from "../types/challenges";
import { useAuth } from "./useAuth";

export const useChallengesProgress = () => {
  const [progress, setProgress] = useState<ChallengesProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await challengesService.getChallengesProgress();
      setProgress(data);
    } catch (err: any) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        logout();
        return;
      }
      setError(err.message || "Failed to fetch challenges progress");
      console.error("Error fetching challenges progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress,
  };
};
